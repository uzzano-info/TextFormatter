"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Check, Trash2, Save, RotateCcw } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import TemplateIcon from "./TemplateIcon";

export default function TemplateMenu() {
  const presets = useAppStore((s) => s.presets);
  const activePresetId = useAppStore((s) => s.activePresetId);
  const modified = useAppStore((s) => s.modified);
  const applyPreset = useAppStore((s) => s.applyPreset);
  const resetToTemplate = useAppStore((s) => s.resetToTemplate);
  const saveCurrentAsPreset = useAppStore((s) => s.saveCurrentAsPreset);
  const deletePreset = useAppStore((s) => s.deletePreset);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  const active = presets.find((p) => p.id === activePresetId);
  const builtIns = presets.filter((p) => p.builtIn);
  const userTemplates = presets.filter((p) => !p.builtIn);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSaving(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="템플릿 선택"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1.5 text-sm text-text transition-colors hover:bg-surface-2"
      >
        {active && (
          <TemplateIcon name={active.icon} size={15} className="text-accent" />
        )}
        <span>{active ? active.name : "템플릿"}</span>
        {modified && <span className="text-xs text-muted">· 수정됨</span>}
        <ChevronDown size={14} className="text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-30 w-64 rounded-md border border-border bg-surface p-1 shadow-md">
          <Section
            items={builtIns}
            activeId={activePresetId}
            onPick={(id) => {
              applyPreset(id);
              setOpen(false);
            }}
          />

          {userTemplates.length > 0 && (
            <>
              <p className="px-2 pb-1 pt-2 text-[11px] font-semibold tracking-wide text-faint">
                내 템플릿
              </p>
              <Section
                items={userTemplates}
                activeId={activePresetId}
                onPick={(id) => {
                  applyPreset(id);
                  setOpen(false);
                }}
                onDelete={(id, nm) => {
                  deletePreset(id);
                  toast.success(`'${nm}' 템플릿을 삭제했습니다`);
                }}
              />
            </>
          )}

          <div className="mt-1 border-t border-border pt-1">
            {modified && (
              <button
                type="button"
                onClick={() => {
                  resetToTemplate();
                  toast.success("템플릿 기본값으로 되돌렸습니다");
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-text hover:bg-surface-2"
              >
                <RotateCcw size={14} className="text-muted" />
                기본값으로 되돌리기
              </button>
            )}

            {saving ? (
              <form
                className="flex items-center gap-1 px-1 py-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveCurrentAsPreset(name);
                  toast.success("내 템플릿으로 저장했습니다");
                  setName("");
                  setSaving(false);
                  setOpen(false);
                }}
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="템플릿 이름"
                  aria-label="템플릿 이름"
                  className="w-full rounded-sm border border-border bg-bg px-2 py-1 text-sm text-text"
                />
                <button
                  type="submit"
                  className="rounded-sm bg-accent px-2 py-1 text-sm text-on-accent hover:bg-accent-hover"
                >
                  저장
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSaving(true)}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-text hover:bg-surface-2"
              >
                <Save size={14} className="text-muted" />
                내 템플릿으로 저장…
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  items,
  activeId,
  onPick,
  onDelete,
}: {
  items: ReturnType<typeof useAppStore.getState>["presets"];
  activeId: string | null;
  onPick: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
}) {
  return (
    <ul>
      {items.map((p) => (
        <li key={p.id} className="group flex items-center">
          <button
            type="button"
            onClick={() => onPick(p.id)}
            className="flex flex-1 items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-text hover:bg-surface-2"
          >
            <span className="flex w-4 justify-center">
              {p.id === activeId && <Check size={14} className="text-accent" />}
            </span>
            <TemplateIcon name={p.icon} size={15} className="text-muted" />
            <span className="flex-1 truncate">{p.name}</span>
          </button>
          {onDelete && (
            <button
              type="button"
              aria-label={`${p.name} 삭제`}
              onClick={() => onDelete(p.id, p.name)}
              className="mr-1 hidden rounded-sm p-1 text-muted hover:bg-surface-2 hover:text-text group-hover:block"
            >
              <Trash2 size={14} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
