"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import Topbar from "@/components/Topbar";
import EditorPanel from "@/components/EditorPanel";
import PreviewPanel from "@/components/PreviewPanel";
import OptionsDrawer from "@/components/OptionsDrawer";
import CopyExportButtons from "@/components/CopyExportButtons";
import TemplateGallery from "@/components/TemplateGallery";

export default function Home() {
  const hydrate = useAppStore((s) => s.hydrate);
  const setInput = useAppStore((s) => s.setInput);
  const hasInput = useAppStore((s) => s.input.trim().length > 0);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 갤러리 화면(빈 입력)에서 그냥 붙여넣어도 입력으로 받는다.
  useEffect(() => {
    if (hasInput) return;
    const onPaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text") ?? "";
      if (text.trim()) {
        e.preventDefault();
        setInput(text);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [hasInput, setInput]);

  return (
    <main className="flex h-screen flex-col bg-bg">
      <Toaster position="bottom-right" duration={3000} richColors />

      <Topbar />

      {/* Workbench + 세부조정 드로어(push) */}
      <div className="flex min-h-0 flex-1">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-row">
          {hasInput ? (
            <>
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
            </>
          ) : (
            <section
              aria-label="템플릿 갤러리"
              className="flex min-h-0 flex-1 bg-surface"
            >
              <TemplateGallery />
            </section>
          )}
        </div>

        <OptionsDrawer />
      </div>

      {/* 액션바 */}
      <div className="flex items-center justify-end border-t border-border bg-surface-2 px-4 py-2">
        <CopyExportButtons />
      </div>

      {/* 푸터 */}
      <footer className="border-t border-border bg-surface px-4 py-1.5 text-center text-xs text-muted">
        이 도구의 모든 변환은 당신의 브라우저 안에서만 처리됩니다. 입력한 텍스트는
        어디에도 전송·저장되지 않습니다.
      </footer>
    </main>
  );
}
