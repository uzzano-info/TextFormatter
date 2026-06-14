"use client";

import { useAppStore } from "@/store/useAppStore";
import type { NormalizeOptions } from "@/lib/transform/types";

type BoolKey = {
  [K in keyof NormalizeOptions]: NormalizeOptions[K] extends boolean ? K : never;
}[keyof NormalizeOptions];

const TOGGLES: { key: BoolKey; label: string }[] = [
  { key: "stripEmoji", label: "이모지 제거" },
  { key: "stripEmojiInHeadings", label: "헤더 이모지만 제거" },
  { key: "simplifyHeadings", label: "헤더 단순화" },
  { key: "normalizeBold", label: "굵게 정리" },
  { key: "unwrapListLeadBold", label: "리스트 리드 굵게 해제" },
  { key: "normalizeListMarker", label: "불릿 통일(-)" },
  { key: "normalizeOrderedList", label: "번호 재정렬" },
  { key: "removeHr", label: "구분선 제거" },
  { key: "collapseBlankLines", label: "빈 줄 축소" },
  { key: "trimTrailingSpaces", label: "줄끝 공백 제거" },
  { key: "smartQuotes", label: "둥근 따옴표" },
  { key: "convertTablesToText", label: "표→텍스트" },
];

export default function OptionsBar() {
  const options = useAppStore((s) => s.options);
  const setOption = useAppStore((s) => s.setOption);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
      {TOGGLES.map((t) => (
        <label
          key={t.key}
          className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700"
        >
          <input
            type="checkbox"
            checked={options[t.key]}
            onChange={(e) => setOption(t.key, e.target.checked)}
            aria-label={t.label}
            className="h-4 w-4 rounded border-slate-300"
          />
          {t.label}
        </label>
      ))}

      <label className="flex items-center gap-1.5 text-sm text-slate-700">
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
          className="rounded border border-slate-300 bg-white px-1 py-0.5"
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </label>
    </div>
  );
}
