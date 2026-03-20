"use client";

import { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";

type SidebarLinkProps = {
  text: string;
  url: string;
  icon: ReactNode;
};

export const SidebarLink = ({ text, url, icon }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === url;

  return (
    <Link
      href={{ pathname: url }}
      className={cn(
        "flex items-center gap-2 !text-gray-600 dark:!text-gray-300 hover:!text-primary-500 dark:hover:!text-primary-400 transition-colors",
        isActive && "!text-primary-500 dark:!text-primary-400 font-semibold",
      )}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};