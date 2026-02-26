"use client";

import { ConfigProvider } from "antd";
import { antdThemeConfig } from "@/utils/antdThemeConfig";
import { ReactNode, useEffect, useState } from "react";

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function AntdProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(
    getSystemTheme
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent) => {
      setCurrentTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <ConfigProvider theme={antdThemeConfig(currentTheme)}>
      {children}
    </ConfigProvider>
  );
}
