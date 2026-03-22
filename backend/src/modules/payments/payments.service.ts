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
    this.secretKey1 = env.ROBOKASSA_TEST_SECRET_KEY_1 || "";
    this.testMode = env.ROBOKASSA_TEST_MODE;
    // Правильный URL для инициализации платежа (единый для теста и продакшена)
    this.baseUrl = "https://auth.robokassa.ru/Merchant/Index.aspx";
  }

  /**
   * Создание платежа
   */
  async createPayment(
    data: CreatePaymentData,
  ): Promise<CreatePaymentResult | null> {
    try {
      const { user_id, tier_id, amount } = data;

      // Генерируем уникальный InvId (invoice ID) — только число!
      const invId = Date.now().toString();

      logger.info(`[Robokassa] Creating payment: user_id=${user_id}, tier_id=${tier_id}, amount=${amount}`);

      // Создаём запись о платеже в БД
      const result = await pool.query<Payment>(
        `
        INSERT INTO payments (user_id, tier_id, amount, status, robokassa_inv_id, description)
        VALUES ($1, $2, $3, 'pending', $4, $5)
        RETURNING *
      `,
        [user_id, tier_id, amount, invId, `Оплата тарифа #${tier_id}`],
      );

      const payment = result.rows[0];
      if (!payment) {
        logger.error("Failed to create payment record");
        return null;
      }

      logger.info(`[Robokassa] Payment record created in DB: id=${payment.id}, inv_id=${invId}`);

      // Формируем данные для подписи (Robokassa требует MD5)
      const signatureString = `${this.merchantId}:${amount.toFixed(2)}:${invId}`;
      const signatureValue = this.generateSignature(signatureString, this.secretKey1);

      logger.info(`[Robokassa] Signature generation:`);
      logger.info(`  - MerchantLogin: ${this.merchantId}`);
      logger.info(`  - OutSum: ${amount.toFixed(2)}`);
      logger.info(`  - InvId: ${invId}`);
      logger.info(`  - TestMode: ${this.testMode}`);
      logger.info(`  - SignatureString: ${signatureString}`);
      logger.info(`  - SignatureValue: ${signatureValue}`);

      // Формируем URL с параметрами для перенаправления
      // Robokassa использует GET параметры для инициализации
      // Обязательные параметры: MerchantLogin, OutSum, SignatureValue
      const redirectUrl = new URL(this.baseUrl);
      redirectUrl.searchParams.set("MerchantLogin", this.merchantId);
      redirectUrl.searchParams.set("OutSum", amount.toFixed(2)); // Формат: 99.00
      redirectUrl.searchParams.set("InvId", invId);
      redirectUrl.searchParams.set("SignatureValue", signatureValue);

      // Добавляем параметр IsTest=1 для тестового режима
      if (this.testMode) {
        redirectUrl.searchParams.set("IsTest", "1");
        logger.info("[Robokassa] Тестовый режим включён (IsTest=1)");
      }

      // Добавляем SuccessURL для редиректа после успешной оплаты
      redirectUrl.searchParams.set("SuccessURL", env.ROBOKASSA_SUCCESS_URL);
      logger.info(`[Robokassa] SuccessURL: ${env.ROBOKASSA_SUCCESS_URL}`);

      const finalUrl = redirectUrl.toString();
      logger.info(`[Robokassa] Final redirect URL: ${finalUrl}`);
      logger.info(`[Robokassa] Payment created successfully: ${payment.id}, InvId: ${invId}`);

      return {
        payment_id: payment.id,
        redirect_url: finalUrl,
        inv_id: invId,
      };
    } catch (error) {
      logger.error("[Robokassa] Error creating payment:", error);
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

    logger.info(`[Robokassa] Webhook получен (Result URL):`);
    logger.info(`  - InvId: ${InvId}`);
    logger.info(`  - OutSum: ${OutSum}`);
    logger.info(`  - SignatureValue (от Robokassa): ${SignatureValue}`);
    logger.info(`  - Shp_itemid: ${Shp_itemid}`);
    logger.info(`  - Shp_user_id: ${Shp_user_id}`);

    // Проверяем подпись через secretKey1
    const isValid = this.verifySignature(OutSum, InvId, SignatureValue, this.secretKey1);

    logger.info(`[Robokassa] Проверка подписи: ${isValid ? "VALID" : "INVALID"}`);

    if (!isValid) {
      logger.error(`[Robokassa] Неверная подпись для платежа ${InvId}`);
      logger.error(`[Robokassa] Ожидаемая подпись: ${this.generateSignature(`${OutSum}:${InvId}`, this.secretKey1)}`);
      return { success: false, signature: "" };
    }

    // Обновляем статус платежа
    try {
      const tierId = Shp_itemid ? parseInt(Shp_itemid, 10) : null;
      const userId = Shp_user_id ? parseInt(Shp_user_id, 10) : null;

      logger.info(`[Robokassa] Обновление статуса платежа ${InvId} на 'success'`);

      const updateResult = await pool.query(
        `
        UPDATE payments
        SET status = 'success',
            robokassa_payment_id = $1,
            updated_at = NOW()
        WHERE robokassa_inv_id = $2
      `,
        [InvId, InvId],
      );

      logger.info(`[Robokassa] Платёж ${InvId} помечен как успешный (обновлено строк: ${updateResult.rowCount})`);

      // Активируем подписку
      if (userId && tierId) {
        logger.info(`[Robokassa] Активация подписки для пользователя ${userId}, тариф ${tierId}`);

        // Деактивируем текущую подписку
        await pool.query(
          `
          UPDATE subscriptions
          SET is_active = FALSE
          WHERE user_id = $1
        `,
          [userId],
        );

        // Создаём новую активную подписку
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

        logger.info(`[Robokassa] Подписка активирована для пользователя ${userId}, тариф ${tierId}`);
      } else {
        logger.warn(`[Robokassa] Отсутствует userId или tierId для активации подписки (userId=${userId}, tierId=${tierId})`);
      }

      logger.info(`[Robokassa] Webhook обработан успешно, возврат подписи: ${SignatureValue}`);
      return { success: true, signature: SignatureValue };
    } catch (error) {
      logger.error("[Robokassa] Ошибка обработки webhook:", error);
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
   * Генерация подписи для запроса через MD5 (требование Robokassa)
   */
  private generateSignature(data: string, secretKey: string): string {
    console.log("Signature: ", `${data}:${secretKey}`);
    return crypto
      .createHash("sha256")
      .update(`${data}:${secretKey}`)
      .digest("hex");
    // .toLowerCase();
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
