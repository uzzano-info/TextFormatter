import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "정제기 — AI Text Formatter",
  description:
    "AI가 출력한 텍스트의 과한 마크다운·이모지·서식을 정리하고 원하는 포맷으로 내보내는 편집기.",
};

// 초기 테마를 paint 전에 적용해 FOUC 방지
const themeInit = `(function(){try{var t=localStorage.getItem('apf:theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="h-full bg-bg font-ui text-text">{children}</body>
    </html>
  );
}
