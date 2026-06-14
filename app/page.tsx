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
  const hasInput = useAppStore((s) => s.input.trim().length > 0);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <main className="flex h-screen flex-col bg-bg">
      <Toaster position="bottom-right" duration={3000} richColors />

      <Topbar />

      {/* Workbench + 세부조정 드로어(push) */}
      <div className="flex min-h-0 flex-1">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-row">
          {/* 입력은 항상 보인다 */}
          <section
            aria-label="입력 패널"
            className="flex min-h-0 flex-1 flex-col border-b border-border bg-surface md:flex-none md:basis-1/2 md:border-b-0 md:border-r"
          >
            <EditorPanel />
          </section>

          {/* 오른쪽만 갤러리 ↔ 결과 전환 */}
          <section
            aria-label={hasInput ? "결과 패널" : "템플릿 갤러리"}
            className="flex min-h-0 flex-1 flex-col bg-surface md:flex-none md:basis-1/2"
          >
            {hasInput ? <PreviewPanel /> : <TemplateGallery />}
          </section>
        </div>

        <OptionsDrawer />
      </div>

      {/* 액션바 */}
      <div className="flex items-center justify-end border-t border-border bg-surface-2 px-4 py-2">
        <CopyExportButtons />
      </div>

      {/* 푸터 */}
      <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 border-t border-border bg-surface px-4 py-1.5 text-center text-xs text-muted">
        <span>
          이 도구의 모든 변환은 당신의 브라우저 안에서만 처리됩니다. 입력한
          텍스트는 어디에도 전송·저장되지 않습니다.
        </span>
        <span className="text-faint">·</span>
        <span>
          © uzzano ·{" "}
          <a
            href="mailto:uzzano.info@gmail.com"
            className="underline hover:text-text"
          >
            문의
          </a>
        </span>
      </footer>
    </main>
  );
}
