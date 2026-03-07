import { Card } from "antd";
import { Logo } from "@/components/UI/Logo";
import { SidebarLink } from "@/components/UI/SidebarLink";
import Link from "next/link";
import { ReactNode } from "react";
import { BarChart2, Search, Settings, User } from "@deemlol/next-icons";
import { UserMenu } from "@/components/UI/UserMenu";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  // const user = await getCurrentUser();

  // if (!user) {
  //   redirect("/");
  // }
  // const { email, firstName, lastName } = user!;

  return (
    <div className="flex gap-2 p-2 h-screen">
      <Card className="w-full max-w-xs !bg-gray-50">
        <Logo />
        <ul className="mt-6 text-base flex flex-col gap-6">
          <SidebarLink
            text="Мои поиски"
            url="/dashboard/search"
            icon={<Search size={24} />}
          />
          <SidebarLink
            text="Статистика"
            url="/dashboard/statistics"
            icon={<BarChart2 size={24} />}
          />
          <SidebarLink
            text="Профиль"
            url="/dashboard/profile"
            icon={<User size={24} />}
          />
          <SidebarLink
            text="Настройки"
            url="/dashboard/settings"
            icon={<Settings size={24} />}
          />
        </ul>
      </Card>
      <div className="flex flex-col gap-2 min-w-0 w-full">
        <Card className="w-full !bg-gray-50 flex justify-end">
          <div className="flex gap-2 items-center">
            <Link
              href={{ pathname: "/dashboard/profile" }}
              className="flex items-center gap-2 !text-black"
            >
              <div
                className="bg-gray-300 flex items-center justify-center rounded-full h-12 w-12 text-xl
            "
              >
                {/*{firstName?.[0] || ""}*/}
                {/*{lastName?.[0] || ""}*/}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">
                  {/*{firstName} {lastName}*/}
                </span>
                {/*<span className="text-gray-500">{email}</span>*/}
              </div>
            </Link>
            <UserMenu />
          </div>
        </Card>
        <Card className="w-full !bg-gray-50 h-full">{children}</Card>
      </div>
    </div>
  );
};

export default DashboardLayout;
