import { Wrapper } from "@/components/common/Wrapper";
import Link from "next/link";
import { AuthButton } from "@/components/UI/AuthButton";
import { Card, Collapse, CollapseProps } from "antd";
import {
  Check,
  MousePointer,
  Power,
  Search,
  Shield,
} from "@deemlol/next-icons";
import { Section } from "@/components/common/Section";
import { Title } from "@/components/common/Title";
import { Logo } from "@/components/UI/Logo";

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "В чем преимущество перед автооткликами hh.ru?",
    children: (
      <p className="text-base font-normal text-gray-500 dark:text-gray-400 text-sm">
        Наш сервис дает вам в 20 раз больше возможностей. Пока hh.ru
        ограничивает 10 автооткликами, мы позволяем отправлять до 200 в сутки. И
        главное — работодатели не видят разницы: отклики выглядят как ручные,
        без пометок об автоматизации.
      </p>
    ),
  },
  {
    key: "2",
    label: "Это безопасно для моего аккаунта?",
    children: (
      <p className="text-base font-normal text-gray-500 dark:text-gray-400 text-sm">
        Абсолютно безопасно. Мы работаем через официальный API hh.ru как
        верифицированный разработчик. Все действия согласованы с платформой и
        соответствуют их правилам.
      </p>
    ),
  },
  {
    key: "3",
    label: "Как быстро отправляются отклики?",
    children: (
      <p className="text-base font-normal text-gray-500 dark:text-gray-400 text-sm">
        Мы реагируем быстрее всех. Сервис проверяет новые вакансии каждые 5
        минут и мгновенно отправляет отклики на подходящие предложения. Вы
        будете в топе откликов, пока другие только просматривают вакансии.
      </p>
    ),
  },
  {
    key: "4",
    label: "Работодатель узнает об автоматизации?",
    children: (
      <p className="text-base font-normal text-gray-500 dark:text-gray-400 text-sm">
        Нет, это конфиденциально. Для работодателя ваш отклик ничем не
        отличается от ручного. Никаких пометок, никаких признаков автоматизации
        — только ваше резюме и интерес к вакансии.
      </p>
    ),
  },
  {
    key: "5",
    label: "Нужно ли постоянно быть онлайн?",
    children: (
      <p className="text-base font-normal text-gray-500 dark:text-gray-400 text-sm">
        Сервис работает без вашего участия. Настроили один раз — и можете
        заниматься своими делами. Система работает на наших серверах 24/7, даже
        когда вы offline.
      </p>
    ),
  },
];

export default function Home() {
  const benefitsData = [
    {
      icon: <MousePointer size={24} />,
      name: "Массовые отклики",
      description: `Автоматизируйте рутину — делайте до 200 откликов в день. Ваше резюме увидят сотни рекрутеров, что кратно увеличивает шансы на отклик`,
    },
    {
      icon: <Check size={24} />,
      name: "Работает в фоне",
      description: `Первым откликается на новые вакансии и работает 24/7. Пока вы занимаетесь своими делами, сервис отправляет ваше резюме работодателям.`,
    },
    {
      icon: <Search size={24} />,
      name: "Точный поиск",
      description: `Откликайтесь только на релевантные вакансии. Настройте фильтры по зарплате, опыту и графику, чтобы автоотклики работали точно по вашим критериям.`,
    },
    {
      icon: <Power size={24} />,
      name: "Простота и скорость",
      description:
        "Запуск за 5 минут. Настройте сервис один раз и больше не тратьте время на монотонную рассылку.",
    },
    {
      icon: <Shield size={24} />,
      name: "Безопасность и надежность",
      description:
        "Работа через официальный API hh.ru. Ваш аккаунт в полной безопасности, мы — верифицированный разработчик.",
    },
  ];

  const howItWorksData = [
    {
      name: "Войдите через hh.ru",
      description:
        "Войдите с помощью hh.ru. Ваши данные в безопасности, мы используем официальный API hh.ru.",
    },
    {
      name: "Создайте поиск",
      description:
        "Укажите должность, зарплату, опыт и другие параметры. Система поймет, какие вакансии вам подходят.",
    },
    {
      name: "Запустите поиск",
      description:
        "Сервис начнет мгновенно откликаться на новые вакансии. Вы получите первые приглашения уже сегодня.",
    },
    {
      name: "Анализируйте статистику",
      description:
        "Отслеживайте эффективность: просмотры, отклики, приглашения. Улучшайте подход на основе данных.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full py-4 border-b border-gray-200 dark:border-gray-700 backdrop-blur bg-white/80 dark:bg-gray-900/80 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
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

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-40 text-center">
          {/* Full-width gradient — светлая тема */}
          <div
            aria-hidden
            className="dark:hidden pointer-events-none absolute inset-x-0 top-0 h-full"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(16,185,129,0.12) 0%, transparent 70%)",
            }}
          />
          {/* Full-width gradient — тёмная тема */}
          <div
            aria-hidden
            className="hidden dark:block pointer-events-none absolute inset-x-0 top-0 h-full"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(52,211,153,0.18) 0%, transparent 70%)",
            }}
          />
          <Wrapper className="relative z-10 !max-w-3xl">
            <h2 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white">
              Автоматизируйте отклики на{" "}
              <span className="text-primary-500 dark:text-primary-400">
                hh.ru
              </span>
            </h2>
            <p className="mb-8 text-xl text-gray-500 dark:text-gray-400">
              Auto Offer автоматически откликается на вакансии и предоставляет
              детальную аналитику. Это помогает быстро скорректировать стратегию
              и найти работу мечты.
            </p>
            <AuthButton arrow={true} text="Начать бесплатно" />
          </Wrapper>
        </section>

        {/* Benefits */}
        <Section
          id="benefits"
          title="Почему выбирают нас?"
          className="bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="flex flex-wrap justify-center gap-6">
            {benefitsData.map((item) => (
              <Card key={item.name} className="w-full max-w-md !rounded-2xl">
                <div className="flex flex-col">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-500/15 text-primary-500 dark:text-primary-400">
                    {item.icon}
                  </div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-base">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* How it works */}
        <Section
          id="how-it-works"
          title="4 шага к новой работе"
          wrapperClasses="!w-full !max-w-5xl !mx-auto"
        >
          <div className="flex flex-col gap-12">
            {howItWorksData.map((item, index) => (
              <div key={item.name} className="flex gap-5">
                <div className="shrink-0 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary-500 text-white text-xl font-bold">
                  {index + 1}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Testimonials */}
        <Section
          id="feedback"
          title="Отзывы"
          className="bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="flex gap-5">
            {[
              {
                name: "Анна",
                role: "Маркетолог",
                text: "За первую неделю сервис отправил 150 откликов! Раньше столько за месяц не успевала. Уже на 3-й день получила 4 приглашения, а через 2 недели вышла на работу мечты. Это в 10 раз эффективнее ручного поиска!",
              },
              {
                name: "Дмитрий",
                role: "Frontend-разработчик",
                text: "Мне понравилась не только автоматизация, но и аналитика. Увидел, что на вакансии с React откликаются в 3 раза чаще. Переписал резюме, сделал акцент на этом навыке — и пошли офферы! Сервис не просто спамит, а помогает найти стратегию.",
              },
              {
                name: "Мария",
                role: "Менеджер проектов",
                text: "Вместо 2 часов в день на hh теперь трачу 5 минут на проверку статистики. Сервис работает сам, а я занимаюсь жизнью. Через 10 дней получила 3 хороших оффера и выбрала лучший. Теперь рекомендую всем друзьям в поиске!",
              },
            ].map(({ name, role, text }) => (
              <div key={name} className="w-full">
                <Card className="h-full">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          {name}
                        </span>
                        <span className="text-sm text-gray-400">{role}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-primary-500 dark:text-primary-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      &#34;{text}&#34;
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </Section>

        {/* FAQ */}
        <Section
          id="faq"
          title="Часто задаваемые вопросы"
          wrapperClasses="!max-w-3xl"
        >
          <Collapse
            items={items}
            accordion
            size="large"
            rootClassName="font-semibold flex flex-col gap-1"
            ghost={true}
          />
        </Section>

        {/* CTA */}
        <Section className="bg-primary-500" wrapperClasses="!max-w-3xl">
          <div className="mb-4 flex flex-col gap-5 items-center dark:text-black/50">
            <Title className="dark:text-black/70 text-center">
              Ваше время стоит дороже рутины
            </Title>
            <p className="text-black/60 text-center">
              Проводите минуты на собеседованиях, а не часы на откликах.
              Автоматизация поиска освобождает до 10 часов в неделю для того,
              что действительно важно.
            </p>
            <AuthButton primary={false} arrow={true} />
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 py-12 bg-white dark:bg-gray-900">
        <Wrapper>
          <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <div className="grid grid-cols-2 gap-4 pb-12">
              <div className="flex flex-col gap-2 items-center">
                <Logo />
                <p className="text-gray-500">
                  Ваш персональный ассистент для поиска работы
                </p>
              </div>
              <div className="flex flex-col gap-3 items-center">
                <div className="flex flex-col gap-1 text-gray-500">
                  <Link
                    href={"/dashboard"}
                    className="hover:text-primary-500 transition-colors"
                  >
                    Авторизоваться
                  </Link>
                  <Link
                    href="/requisites"
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
            <div className="pt-6 text-center text-gray-500">
              © 2025 Auto Offer. Все права защищены.
            </div>
          </div>
        </Wrapper>
      </footer>
    </div>
  );
}
