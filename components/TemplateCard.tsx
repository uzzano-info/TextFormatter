"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import type { Preset } from "@/lib/transform/types";
import { miniPreview } from "@/lib/transform/miniPreview";
import TemplateIcon from "./TemplateIcon";

interface Props {
  preset: Preset;
  active: boolean;
  onSelect: () => void;
  onKeyNav?: (dir: -1 | 1) => void;
}

export default function TemplateCard({
  preset,
  active,
  onSelect,
  onKeyNav,
}: Props) {
  const preview = useMemo(() => miniPreview(preset), [preset]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`${preset.name} 템플릿 선택`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          onKeyNav?.(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          onKeyNav?.(-1);
        }
      }}
      className={`group flex cursor-pointer flex-col rounded-md border bg-surface p-4 shadow-sm transition-all duration-150 hover:-translate-y-px hover:shadow-md ${
        active
          ? "border-accent ring-1 ring-accent"
          : "border-border hover:border-accent"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-2 text-accent">
          <TemplateIcon name={preset.icon} size={20} />
        </span>
        <span className="text-[16px] font-medium text-text">{preset.name}</span>
        {preset.recommended && (
          <span className="ml-auto rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
            추천
          </span>
        )}
      </div>

      <p className="text-[13px] leading-snug text-muted">{preset.tagline}</p>

      {preset.targets.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {preset.targets.map((t) => (
            <span
              key={t}
              className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* before → after 미니 프리뷰 */}
      <div className="mt-3 flex items-center gap-2 rounded-sm bg-surface-2 px-2.5 py-2 font-mono text-xs">
        <span className="truncate text-faint line-through">
          {preview.before}
        </span>
        <ArrowRight size={12} className="shrink-0 text-muted" />
        <span className="truncate font-medium text-text">{preview.after}</span>
      </div>
    </div>
  );
}
