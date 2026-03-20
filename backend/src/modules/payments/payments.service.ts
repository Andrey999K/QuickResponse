import crypto from "crypto";
import { pool } from "@/config/db/connection";
import { logger } from "@/utils/log";
import { env } from "@/config/env";
import { CreatePaymentData, CreatePaymentResult, Payment, RobokassaWebhookData } from "./payments.types";

/**
 * Сервис для работы с платежами Robokassa
 */
export class PaymentService {
  private readonly merchantId: string;
  private readonly secretKey1: string;
  private readonly testMode: boolean;
  private readonly baseUrl: string;

  constructor() {
    this.merchantId = env.ROBOKASSA_MERCHANT_ID || "";
    this.secretKey1 = env.ROBOKASSA_SECRET_KEY_1 || "";
    this.testMode = env.ROBOKASSA_TEST_MODE;
    this.baseUrl = this.testMode
      ? "https://auth.robokassa.ru/pay/"
      : "https://auth.robokassa.ru/pay/";
  }

  /**
   * Создание платежа
   */
  async createPayment(
    data: CreatePaymentData,
  ): Promise<CreatePaymentResult | null> {
    try {
      const { user_id, tier_id, amount, email, description } = data;

      // Генерируем уникальный InvId (invoice ID)
      const invId = `INV-${user_id}-${tier_id}-${Date.now()}`;

      // Создаём запись о платеже в БД
      const result = await pool.query<Payment>(
        `
        INSERT INTO payments (user_id, tier_id, amount, status, robokassa_inv_id, description)
        VALUES ($1, $2, $3, 'pending', $4, $5)
        RETURNING *
      `,
        [user_id, tier_id, amount, invId, description || `Оплата тарифа #${tier_id}`],
      );

      const payment = result.rows[0];
      if (!payment) {
        logger.error("Failed to create payment record");
        return null;
      }

      // Формируем данные для подписи
      const signatureValue = this.generateSignature(
        `${this.merchantId}:${amount}:${invId}`,
        this.secretKey1,
      );

      // Формируем URL для перенаправления на оплату
      const redirectUrl = new URL(this.baseUrl);
      redirectUrl.searchParams.set("MerchantId", this.merchantId);
      redirectUrl.searchParams.set("OutSum", amount.toString());
      redirectUrl.searchParams.set("InvId", invId);
      redirectUrl.searchParams.set("SignatureValue", signatureValue);
      redirectUrl.searchParams.set("Shp_itemid", tier_id.toString());
      redirectUrl.searchParams.set("Shp_user_id", user_id.toString());
      redirectUrl.searchParams.set("Email", email);
      redirectUrl.searchParams.set("IsTest", this.testMode ? "1" : "0");

      logger.info(`Payment created: ${payment.id}, InvId: ${invId}`);

      return {
        payment_id: payment.id,
        redirect_url: redirectUrl.toString(),
        inv_id: invId,
      };
    } catch (error) {
      logger.error("Error creating payment:", error);
      return null;
    }
  }

  /**
   * Обработка webhook от Robokassa (Result URL)
   */
  async handleResultWebhook(
    data: RobokassaWebhookData,
  ): Promise<{ success: boolean; signature: string }> {
    const { InvId, OutSum, SignatureValue, Shp_itemid, Shp_user_id } = data;

    // Проверяем подпись
    const isValid = this.verifySignature(OutSum, InvId, SignatureValue, this.secretKey1);

    if (!isValid) {
      logger.error(`Invalid signature for payment ${InvId}`);
      return { success: false, signature: "" };
    }

    // Обновляем статус платежа
    try {
      const tierId = Shp_itemid ? parseInt(Shp_itemid, 10) : null;
      const userId = Shp_user_id ? parseInt(Shp_user_id, 10) : null;

      await pool.query(
        `
        UPDATE payments
        SET status = 'success',
            robokassa_payment_id = $1,
            updated_at = NOW()
        WHERE robokassa_inv_id = $2
      `,
        [InvId, InvId],
      );

      logger.info(`Payment ${InvId} marked as successful`);

      // Активируем подписку
      if (userId && tierId) {
        await pool.query(
          `
          UPDATE subscriptions
          SET is_active = FALSE
          WHERE user_id = $1
        `,
          [userId],
        );

        await pool.query(
          `
          INSERT INTO subscriptions (user_id, tier_id, payment_id, is_active)
          VALUES ($1, $2, $3, TRUE)
          ON CONFLICT (user_id, is_active) DO UPDATE
          SET tier_id = $2, payment_id = $3, is_active = TRUE, start_date = NOW()
        `,
          [userId, tierId, InvId],
        );

        // Обновляем subscription_tier_id в users
        await pool.query(
          `
          UPDATE users
          SET subscription_tier_id = $1
          WHERE id = $2
        `,
          [tierId, userId],
        );

        logger.info(`Subscription activated for user ${userId}, tier ${tierId}`);
      }

      return { success: true, signature: SignatureValue };
    } catch (error) {
      logger.error("Error handling webhook:", error);
      return { success: false, signature: "" };
    }
  }

  /**
   * Проверка статуса платежа
   */
  async getPaymentStatus(paymentId: number): Promise<Payment | null> {
    try {
      const result = await pool.query<Payment>(
        "SELECT * FROM payments WHERE id = $1",
        [paymentId],
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error fetching payment status:", error);
      return null;
    }
  }

  /**
   * История платежей пользователя
   */
  async getUserPayments(userId: number): Promise<Payment[]> {
    try {
      const result = await pool.query<Payment>(
        `
        SELECT * FROM payments
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
        [userId],
      );
      return result.rows;
    } catch (error) {
      logger.error("Error fetching user payments:", error);
      return [];
    }
  }

  /**
   * Генерация подписи для запроса
   */
  private generateSignature(data: string, secretKey: string): string {
    return crypto
      .createHash("sha256")
      .update(`${data}:${secretKey}`)
      .digest("hex")
      .toLowerCase();
  }

  /**
   * Проверка подписи от Robokassa
   */
  private verifySignature(
    outSum: string,
    invId: string,
    signature: string,
    secretKey: string,
  ): boolean {
    const expectedSignature = this.generateSignature(
      `${outSum}:${invId}`,
      secretKey,
    );
    return expectedSignature === signature;
  }
}
