import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "정제기 — AI Text Formatter",
  description:
    "AI가 출력한 텍스트의 과한 마크다운·이모지·서식을 정리하고 원하는 포맷으로 내보내는 편집기.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="h-full bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
