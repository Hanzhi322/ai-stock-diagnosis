import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "证研 · 个股证据工作台",
  description: "宁德时代多维诊断：追溯原始财报，验证增长质量，区分事实、推断与未知。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
