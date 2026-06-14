"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import Topbar from "@/components/Topbar";
import EditorPanel from "@/components/EditorPanel";
import PreviewPanel from "@/components/PreviewPanel";
import OptionsBar from "@/components/OptionsBar";
import CopyExportButtons from "@/components/CopyExportButtons";

export default function Home() {
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <main className="flex h-screen flex-col bg-bg">
      <Toaster position="bottom-right" duration={3000} richColors />

      <Topbar />

      {/* Workbench: 좌(입력) / 우(결과) — 모바일은 상하 분할 */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <section
          aria-label="입력 패널"
          className="flex min-h-0 flex-1 flex-col border-b border-border bg-surface md:flex-none md:basis-1/2 md:border-b-0 md:border-r"
        >
          <EditorPanel />
        </section>
        <section
          aria-label="결과 패널"
          className="flex min-h-0 flex-1 flex-col bg-surface md:flex-none md:basis-1/2"
        >
          <PreviewPanel />
        </section>
      </div>

      {/* 옵션바 + 액션바 */}
      <div className="flex flex-col gap-2 border-t border-border bg-surface-2 px-1 py-1 sm:flex-row sm:items-center sm:justify-between">
        <OptionsBar />
        <div className="px-4 pb-2 sm:pb-0">
          <CopyExportButtons />
        </div>
      </div>

      {/* 푸터 */}
      <footer className="border-t border-border bg-surface px-4 py-1.5 text-center text-xs text-muted">
        이 도구의 모든 변환은 당신의 브라우저 안에서만 처리됩니다. 입력한 텍스트는
        어디에도 전송·저장되지 않습니다.
      </footer>
    </main>
  );
}
