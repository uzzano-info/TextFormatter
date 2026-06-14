"use client";

import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";
import TemplateCard from "./TemplateCard";

export default function TemplateGallery() {
  const presets = useAppStore((s) => s.presets);
  const activePresetId = useAppStore((s) => s.activePresetId);
  const applyPreset = useAppStore((s) => s.applyPreset);
  const loadSample = useAppStore((s) => s.loadSample);
  const t = useT();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const builtIns = presets.filter((p) => p.builtIn);
  const userTemplates = presets.filter((p) => !p.builtIn);

  function focusCard(index: number) {
    const cards =
      containerRef.current?.querySelectorAll<HTMLElement>('[role="button"]');
    if (!cards || cards.length === 0) return;
    const next = (index + cards.length) % cards.length;
    cards[next]?.focus();
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto px-5 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <div className="mb-4">
          <h2 className="text-[16px] font-semibold text-text">
            {t("gallery.heading")}
          </h2>
          <p className="mt-1 text-sm text-muted">{t("gallery.sub")}</p>
        </div>

        <div ref={containerRef} className="flex flex-col gap-3">
          {builtIns.map((p, i) => (
            <TemplateCard
              key={p.id}
              preset={p}
              active={p.id === activePresetId}
              onSelect={() => applyPreset(p.id)}
              onKeyNav={(dir) => focusCard(i + dir)}
            />
          ))}
        </div>

        {userTemplates.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-[13px] font-semibold tracking-wide text-muted">
              {t("gallery.myTemplates")}
            </p>
            <div className="flex flex-col gap-3">
              {userTemplates.map((p) => (
                <TemplateCard
                  key={p.id}
                  preset={p}
                  active={p.id === activePresetId}
                  onSelect={() => applyPreset(p.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <button
            type="button"
            onClick={loadSample}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-2"
          >
            <Sparkles size={15} className="text-accent" />
            {t("gallery.trySample")}
          </button>
        </div>
      </div>
    </div>
  );
}
