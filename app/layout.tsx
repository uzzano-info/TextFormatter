import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Text Formatter by uzzano",
  description:
    "AI가 출력한 텍스트의 과한 마크다운·이모지·서식을 정리하고 블로그·메모·플레인 등 원하는 포맷으로 내보내는 편집기. 모든 처리는 브라우저 안에서만 이루어집니다.",
  applicationName: "AI Text Formatter",
  authors: [{ name: "uzzano", url: "mailto:uzzano.info@gmail.com" }],
  creator: "uzzano",
  keywords: ["AI", "텍스트 정리", "마크다운", "블로그", "ChatGPT", "uzzano"],
  openGraph: {
    title: "AI Text Formatter by uzzano",
    description:
      "AI 답변의 과한 서식·이모지를 정리해 블로그·메모·플레인으로. 브라우저 안에서만 처리.",
    siteName: "AI Text Formatter",
    locale: "ko_KR",
    type: "website",
  },
  robots: { index: true, follow: true },
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
