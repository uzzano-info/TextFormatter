"use client";

import { useAppStore } from "@/store/useAppStore";
import type { NormalizeOptions } from "@/lib/transform/types";
import Switch from "./Switch";

type BoolKey = {
  [K in keyof NormalizeOptions]: NormalizeOptions[K] extends boolean ? K : never;
}[keyof NormalizeOptions];

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

export default function OptionsContent() {
  const options = useAppStore((s) => s.options);
  const setOption = useAppStore((s) => s.setOption);

  return (
    <div className="flex flex-col gap-5">
      {GROUPS.map((g) => (
        <div key={g.title}>
          <p className="mb-2 text-[13px] font-semibold tracking-wide text-muted">
            {g.title}
          </p>
          <div className="flex flex-col">
            {g.items.map((t) => (
              <div
                key={t.key}
                className="flex h-9 items-center justify-between"
              >
                <span className="text-sm text-text">{t.label}</span>
                <Switch
                  checked={options[t.key]}
                  onChange={(v) => setOption(t.key, v)}
                  label={t.label}
                  hideLabel
                />
              </div>
            ))}
            {g.title === "구조" && (
              <div className="flex h-9 items-center justify-between">
                <span className="text-sm text-text">최대 헤더 깊이</span>
                <select
                  aria-label="최대 헤더 깊이"
                  value={options.maxHeadingDepth}
                  onChange={(e) =>
                    setOption(
                      "maxHeadingDepth",
                      Number(e.target.value) as 2 | 3 | 4,
                    )
                  }
                  className="rounded-sm border border-border bg-bg px-1.5 py-0.5 text-sm text-text"
                >
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
