import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linkarda｜看见城市，也收藏城市",
  description: "发现、收藏和购买全球独立创作者的城市摄影图集。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
