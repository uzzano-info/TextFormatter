"use client";

import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";
import type { NormalizeOptions } from "@/lib/transform/types";
import Switch from "./Switch";

type BoolKey = {
  [K in keyof NormalizeOptions]: NormalizeOptions[K] extends boolean ? K : never;
}[keyof NormalizeOptions];

const GROUPS: { titleKey: string; items: BoolKey[] }[] = [
  {
    titleKey: "opt.group.clean",
    items: [
      "stripEmoji",
      "stripEmojiInHeadings",
      "normalizeBold",
      "unwrapListLeadBold",
      "removeHr",
    ],
  },
  {
    titleKey: "opt.group.structure",
    items: ["simplifyHeadings", "normalizeListMarker", "normalizeOrderedList"],
  },
  {
    titleKey: "opt.group.refine",
    items: [
      "collapseBlankLines",
      "trimTrailingSpaces",
      "smartQuotes",
      "convertTablesToText",
    ],
  },
];

export default function OptionsContent() {
  const options = useAppStore((s) => s.options);
  const setOption = useAppStore((s) => s.setOption);
  const t = useT();

  return (
    <div className="flex flex-col gap-5">
      {GROUPS.map((g) => (
        <div key={g.titleKey}>
          <p className="mb-2 text-[13px] font-semibold tracking-wide text-muted">
            {t(g.titleKey)}
          </p>
          <div className="flex flex-col">
            {g.items.map((key) => {
              const label = t(`opt.${key}`);
              return (
                <div
                  key={key}
                  className="flex h-9 items-center justify-between"
                >
                  <span className="text-sm text-text">{label}</span>
                  <Switch
                    checked={options[key]}
                    onChange={(v) => setOption(key, v)}
                    label={label}
                    hideLabel
                  />
                </div>
              );
            })}
            {g.titleKey === "opt.group.structure" && (
              <div className="flex h-9 items-center justify-between">
                <span className="text-sm text-text">{t("opt.maxDepth")}</span>
                <select
                  aria-label={t("opt.maxDepth")}
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
