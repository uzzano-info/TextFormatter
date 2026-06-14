"use client";

import { useAppStore } from "@/store/useAppStore";
import { totalChanges } from "@/lib/transform/computeStats";

const CHIP_DEFS: { key: "emoji" | "headings" | "hr" | "bold" | "list"; label: (n: number) => string }[] = [
  { key: "emoji", label: (n) => `이모지 −${n}` },
  { key: "headings", label: (n) => `헤더 정리 ${n}` },
  { key: "hr", label: (n) => `구분선 −${n}` },
  { key: "bold", label: (n) => `굵게 정리 ${n}` },
  { key: "list", label: (n) => `리스트 정리 ${n}` },
];

export default function SummaryChips() {
  const stats = useAppStore((s) => s.stats);
  const total = totalChanges(stats);

  if (total === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 border-b border-border px-4 py-2"
      aria-label="정리 요약"
    >
      {CHIP_DEFS.filter((d) => stats[d.key] > 0).map((d) => (
        <span
          key={d.key}
          className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted"
        >
          {d.label(stats[d.key])}
        </span>
      ))}
    </div>
  );
}
