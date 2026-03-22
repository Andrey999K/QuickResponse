import { ReactNode } from "react";
import { Wrapper } from "@/components/common/Wrapper";
import { Logo } from "@/components/UI/Logo";
import Link from "next/link";
import { AuthButton } from "@/components/UI/AuthButton";
import { PublicFooter } from "@/components/UI/PublicFooter";

type PublicLayoutProps = {
  children: ReactNode;
};

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div
      className="flex min-h-screen flex-col bg-white dark:bg-gray-900 text-gray-900
      dark:text-gray-100 transition-colors">
      {/* Header */}
      <header
        className="sticky top-0 z-40 w-full py-4 border-b border-gray-200 dark:border-gray-700 backdrop-blur bg-white/80 dark:bg-gray-900/80 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <Wrapper>
          <div className="flex gap-5 items-center justify-between">
            <Logo />
            <nav className="flex items-center gap-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
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
                FAQ
              </Link>
              <AuthButton />
            </nav>
          </div>
        </Wrapper>
      </header>
      {children}
      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;