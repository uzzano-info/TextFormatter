"use client";

import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";
import { totalChanges } from "@/lib/transform/computeStats";

const CHIP_DEFS: { key: "emoji" | "headings" | "hr" | "bold" | "list"; tkey: string }[] = [
  { key: "emoji", tkey: "chip.emoji" },
  { key: "headings", tkey: "chip.headings" },
  { key: "hr", tkey: "chip.hr" },
  { key: "bold", tkey: "chip.bold" },
  { key: "list", tkey: "chip.list" },
];

export default function SummaryChips() {
  const stats = useAppStore((s) => s.stats);
  const t = useT();
  const total = totalChanges(stats);

  if (total === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 border-b border-border px-4 py-2"
      aria-label={t("summary.aria")}
    >
      {CHIP_DEFS.filter((d) => stats[d.key] > 0).map((d) => (
        <span
          key={d.key}
          className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted"
        >
          {t(d.tkey, { n: stats[d.key] })}
        </span>
      ))}
    </div>
  );
}
