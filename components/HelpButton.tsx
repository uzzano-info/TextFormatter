"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="도움말"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
      >
        <HelpCircle size={18} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="도움말"
          className="absolute right-0 top-10 z-20 w-72 rounded-md border border-border bg-surface p-4 text-sm shadow-md"
        >
          <p className="mb-2 font-medium text-text">
            이 도구는 AI 답변의 과한 서식·이모지를 정리합니다.
          </p>
          <ul className="mb-3 space-y-1 text-muted">
            <li>
              <kbd className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-xs">
                ⌘V
              </kbd>{" "}
              왼쪽에 붙여넣기
            </li>
            <li>
              <kbd className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-xs">
                ⌘C
              </kbd>{" "}
              결과 복사 (입력 포커스가 아닐 때)
            </li>
          </ul>
          <p className="text-xs text-faint">
            모든 변환은 브라우저 안에서만 처리됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
