import { theme } from "antd";

const { defaultAlgorithm, darkAlgorithm } = theme;

export const antdThemeConfig = (currentTheme: "light" | "dark") => ({
  algorithm: currentTheme === "dark" ? darkAlgorithm : defaultAlgorithm,
  cssVar: { prefix: "ant" },
  token: {
    colorPrimary: currentTheme === "dark" ? "#34d399" : "#10b981",
    colorTextBase: currentTheme === "dark" ? "#f9fafb" : "#1f2937",
    colorBgBase: currentTheme === "dark" ? "#111827" : "#ffffff",
    // Убирает синеватый оттенок карточек — явно задаём нейтральный серый
    colorBgContainer: currentTheme === "dark" ? "#1f2937" : "#ffffff",
    colorBgElevated: currentTheme === "dark" ? "#1f2937" : "#ffffff",
    colorLinkActive: currentTheme === "dark" ? "#34d399" : "#10b981",
    colorLink: currentTheme === "dark" ? "#34d399" : "#10b981",
    colorLinkHover: currentTheme === "dark" ? "#34d399" : "#10b981",
    colorBorder: currentTheme === "dark" ? "#374151" : "#e5e7eb",
    colorBorderSecondary: currentTheme === "dark" ? "#374151" : "#e5e7eb",
  },
});
