import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Text Formatter by uzzano",
  description:
    "Paste an AI answer and instantly tidy its heavy markdown, emoji, and formatting — then export it as a blog post, note, or plain text. Everything runs in your browser.",
  applicationName: "AI Text Formatter",
  authors: [{ name: "uzzano", url: "mailto:uzzano.info@gmail.com" }],
  creator: "uzzano",
  keywords: [
    "AI",
    "text formatter",
    "markdown",
    "blog",
    "ChatGPT",
    "Claude",
    "uzzano",
  ],
  openGraph: {
    title: "AI Text Formatter by uzzano",
    description:
      "Tidy AI-answer formatting and emoji into clean blog posts, notes, or plain text — all in your browser.",
    siteName: "AI Text Formatter",
    locale: "en_US",
    alternateLocale: "ko_KR",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="h-full bg-bg font-ui text-text">{children}</body>
    </html>
  );
}
