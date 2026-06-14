"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import type { NormalizeOptions } from "@/lib/transform/types";
import Switch from "./Switch";

type BoolKey = {
  [K in keyof NormalizeOptions]: NormalizeOptions[K] extends boolean ? K : never;
}[keyof NormalizeOptions];

// 간단 모드에 노출할 핵심 토글
const SIMPLE: { key: BoolKey; label: string }[] = [
  { key: "stripEmoji", label: "이모지 제거" },
  { key: "simplifyHeadings", label: "헤더 정리" },
  { key: "normalizeBold", label: "굵게 정리" },
  { key: "removeHr", label: "구분선 제거" },
];

const GROUPS: { title: string; items: { key: BoolKey; label: string }[] }[] = [
  {
    title: "정리",
    items: [
      { key: "stripEmoji", label: "이모지 제거" },
      { key: "stripEmojiInHeadings", label: "헤더 이모지만 제거" },
      { key: "normalizeBold", label: "굵게 정리" },
      { key: "unwrapListLeadBold", label: "리스트 리드 굵게 해제" },
      { key: "removeHr", label: "구분선 제거" },
    ],
  },
  {
    title: "구조",
    items: [
      { key: "simplifyHeadings", label: "헤더 정리" },
      { key: "normalizeListMarker", label: "불릿 통일 (-)" },
      { key: "normalizeOrderedList", label: "번호 재정렬" },
    ],
  },
  {
    title: "다듬기",
    items: [
      { key: "collapseBlankLines", label: "빈 줄 축소" },
      { key: "trimTrailingSpaces", label: "줄끝 공백 제거" },
      { key: "smartQuotes", label: "둥근 따옴표" },
      { key: "convertTablesToText", label: "표 → 텍스트" },
    ],
  },
];

export default function OptionsBar() {
  const options = useAppStore((s) => s.options);
  const setOption = useAppStore((s) => s.setOption);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
      {SIMPLE.map((t) => (
        <Switch
          key={t.key}
          checked={options[t.key]}
          onChange={(v) => setOption(t.key, v)}
          label={t.label}
        />
      ))}

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="고급 옵션 더보기"
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
        >
          <SlidersHorizontal size={14} />
          더보기
        </button>

        {open && (
          <div className="absolute bottom-10 left-0 z-30 w-72 rounded-md border border-border bg-surface p-3 shadow-md">
            {GROUPS.map((g) => (
              <div key={g.title} className="mb-3 last:mb-0">
                <p className="mb-1.5 text-[13px] font-semibold tracking-wide text-muted">
                  {g.title}
                </p>
                <div className="flex flex-col gap-2">
                  {g.items.map((t) => (
                    <Switch
                      key={t.key}
                      checked={options[t.key]}
                      onChange={(v) => setOption(t.key, v)}
                      label={t.label}
                    />
                  ))}
                </div>
                {g.title === "구조" && (
                  <label className="mt-2 flex items-center gap-2 text-sm text-text">
                    최대 헤더 깊이
                    <select
                      aria-label="최대 헤더 깊이"
                      value={options.maxHeadingDepth}
                      onChange={(e) =>
                        setOption(
                          "maxHeadingDepth",
                          Number(e.target.value) as 2 | 3 | 4,
                        )
                      }
                      className="rounded-sm border border-border bg-bg px-1.5 py-0.5 text-text"
                    >
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </label>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
