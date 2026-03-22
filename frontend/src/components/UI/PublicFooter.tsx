import { Wrapper } from "@/components/common/Wrapper";
import { Logo } from "@/components/UI/Logo";
import Link from "next/link";

export const PublicFooter = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 py-12 bg-white dark:bg-gray-900">
      <Wrapper>
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <div className="grid grid-cols-2 gap-4 pb-12">
            <div className="flex flex-col gap-2 items-center">
              <Logo />
              <p className="text-gray-500 dark:text-gray-400">
                Ваш персональный ассистент для поиска работы
              </p>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <div className="flex flex-col gap-1 text-gray-500 dark:text-gray-400">
                <Link
                  href={"/dashboard"}
                  className="hover:text-primary-500 transition-colors"
                >
                  Авторизоваться
                </Link>
                <Link
                  href={"/requisites"}
                  className="hover:text-primary-500 transition-colors"
                >
                  Реквизиты
                </Link>
                <Link
                  href="/#benefits"
                  className="hover:text-primary-500 transition-colors"
                >
                  Преимущества
                </Link>
                <Link
                  href="/#how-it-works"
                  className="hover:text-primary-500 transition-colors"
                >
                  Как это работает
                </Link>
                <Link
                  href="/#feedback"
                  className="hover:text-primary-500 transition-colors"
                >
                  Отзывы
                </Link>
                <Link
                  href="/#faq"
                  className="hover:text-primary-500 transition-colors"
                >
                  Частые вопросы
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-6 text-center text-gray-500 dark:text-gray-400">
            © 2025 Auto Offer. Все права защищены.
          </div>
        </div>
      </Wrapper>
    </footer>
  );
};