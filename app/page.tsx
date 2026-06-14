"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import EditorPanel from "@/components/EditorPanel";
import PreviewPanel from "@/components/PreviewPanel";
import OptionsBar from "@/components/OptionsBar";
import PresetManager from "@/components/PresetManager";

export default function Home() {
  const hydrate = useAppStore((s) => s.hydrate);
  const detectedSource = useAppStore((s) => s.detectedSource);
  const detectScore = useAppStore((s) => s.detectScore);
  const hasInput = useAppStore((s) => s.input.trim().length > 0);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <main className="flex h-screen flex-col">
      <Toaster position="bottom-right" duration={3000} richColors />

      {/* 상단바 */}
      <header className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-white px-4 py-2">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-bold">정제기</h1>
          <span className="text-xs text-slate-500">AI Text Formatter</span>
        </div>
        {hasInput && detectedSource !== "unknown" && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            감지: {detectedSource} ({Math.round(detectScore * 100)}%)
          </span>
        )}
        <div className="ml-auto">
          <PresetManager />
        </div>
      </header>

      {/* 2분할 본문 */}
      <div className="flex min-h-0 flex-1">
        <section
          aria-label="입력 패널"
          className="flex w-1/2 flex-col border-r border-slate-200 bg-white"
        >
          <EditorPanel />
        </section>
        <section
          aria-label="미리보기 패널"
          className="flex w-1/2 flex-col bg-white"
        >
          <PreviewPanel />
        </section>
      </div>

      {/* 옵션바 */}
      <div className="border-t border-slate-200 bg-white">
        <OptionsBar />
      </div>

      {/* 푸터 (프라이버시 문구) */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-1.5 text-center text-xs text-slate-500">
        이 도구의 모든 변환은 당신의 브라우저 안에서만 처리됩니다. 입력한 텍스트는
        어디에도 전송·저장되지 않습니다.
      </footer>
    </main>
  );
}
