"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";

type SidebarLinkProps = {
  text: string;
  url: string;
  icon: ReactNode;
};

export const SidebarLink = ({ text, url, icon }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <Link
      href={{ pathname: url }}
      className={cn(
        "flex items-center gap-2 !text-black",
        isActive(url) ? "font-semibold" : ""
      )}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};
