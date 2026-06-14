"use client";

import { X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";
import OptionsContent from "./OptionsContent";

export default function OptionsDrawer() {
  const open = useAppStore((s) => s.optionsOpen);
  const setOpen = useAppStore((s) => s.setOptionsOpen);
  const t = useT();

  if (!open) return null;

  return (
    <>
      {/* 데스크탑: 우측 push 도크 (본문을 덮지 않고 레이아웃을 밀어냄) */}
      <aside
        aria-label={t("drawer.title")}
        className="hidden w-[280px] shrink-0 flex-col border-l border-border bg-surface md:flex"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-[13px] font-semibold tracking-wide text-muted">
            {t("drawer.title")}
          </span>
          <button
            type="button"
            aria-label={t("drawer.close")}
            onClick={() => setOpen(false)}
            className="rounded-sm p-1 text-muted hover:bg-surface-2 hover:text-text"
          >
            <X size={16} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
          <OptionsContent />
        </div>
      </aside>

      {/* 모바일: 바텀 시트 */}
      <div className="md:hidden">
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-label={t("drawer.title")}
          className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-auto rounded-t-lg border-t border-border bg-surface p-4 shadow-md"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-semibold tracking-wide text-muted">
              {t("drawer.title")}
            </span>
            <button
              type="button"
              aria-label={t("drawer.close")}
              onClick={() => setOpen(false)}
              className="rounded-sm p-1 text-muted hover:bg-surface-2 hover:text-text"
            >
              <X size={16} />
            </button>
          </div>
          <OptionsContent />
        </div>
      </div>
    </>
  );
}
