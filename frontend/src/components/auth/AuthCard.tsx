import Link from "next/link";
import { Logo } from "@/components/UI/Logo";
import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export const AuthCard = ({
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full py-4 border-b border-gray-200 dark:border-gray-700 backdrop-blur bg-white/80 dark:bg-gray-900/80 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="w-full max-w-screen-2xl mx-auto px-4">
          <div className="flex gap-5 items-center justify-between">
            <Logo />
            <Link
              href="/"
              className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
            >
              ← На главную
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center relative py-20">
        {/* Фоновый градиент — светлая тема */}
        <div
          aria-hidden
          className="dark:hidden pointer-events-none absolute inset-x-0 top-0 h-full"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(16,185,129,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Фоновый градиент — тёмная тема */}
        <div
          aria-hidden
          className="hidden dark:block pointer-events-none absolute inset-x-0 top-0 h-full"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(52,211,153,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full max-w-sm px-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-8 flex flex-col gap-6">
            {/* Заголовок */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-xl mb-1" />
              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            </div>

            {children}

            {footer}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-6 bg-white dark:bg-gray-900">
        <div className="w-full max-w-screen-2xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2025 Auto Offer. Все права защищены.
        </div>
      </footer>
    </div>
  );
};
