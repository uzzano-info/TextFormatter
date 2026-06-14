"use client";

import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import TemplateCard from "./TemplateCard";

export default function TemplateGallery() {
  const presets = useAppStore((s) => s.presets);
  const activePresetId = useAppStore((s) => s.activePresetId);
  const applyPreset = useAppStore((s) => s.applyPreset);
  const loadSample = useAppStore((s) => s.loadSample);
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
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center px-6 py-8">
      <div className="mb-5 text-center">
        <h2 className="text-[18px] font-semibold text-text">
          어디에 붙여넣을지 고르면 바로 정리해 드려요
        </h2>
        <p className="mt-1 text-sm text-muted">
          나중에 세부조정도 됩니다. 또는 왼쪽에 그냥 붙여넣어도 돼요.
        </p>
      </div>

      <div
        ref={containerRef}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
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
            내 템플릿
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          <Sparkles size={15} className="text-accent" />
          예시로 체험하기
        </button>
      </div>
    </div>
  );
}
