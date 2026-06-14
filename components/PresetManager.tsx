"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Check, Trash2, Save } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function PresetManager() {
  const presets = useAppStore((s) => s.presets);
  const activePresetId = useAppStore((s) => s.activePresetId);
  const applyPreset = useAppStore((s) => s.applyPreset);
  const saveCurrentAsPreset = useAppStore((s) => s.saveCurrentAsPreset);
  const deletePreset = useAppStore((s) => s.deletePreset);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  const active = presets.find((p) => p.id === activePresetId);
  const label = active ? active.name : "사용자 지정";
  const modified = !activePresetId;

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
        aria-label="프리셋 선택"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1.5 text-sm text-text transition-colors hover:bg-surface-2"
      >
        <span>{label}</span>
        {modified && <span className="text-xs text-muted">· 수정됨</span>}
        <ChevronDown size={14} className="text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-20 w-60 rounded-md border border-border bg-surface p-1 shadow-md">
          <ul className="max-h-72 overflow-auto">
            {presets.map((p) => (
              <li key={p.id} className="group flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    applyPreset(p.id);
                    setOpen(false);
                  }}
                  className="flex flex-1 items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-text hover:bg-surface-2"
                >
                  <span className="flex w-4 justify-center">
                    {p.id === activePresetId && (
                      <Check size={14} className="text-accent" />
                    )}
                  </span>
                  <span className="flex-1 truncate">{p.name}</span>
                  {!p.builtIn && (
                    <span className="text-xs text-faint">내 프리셋</span>
                  )}
                </button>
                {!p.builtIn && (
                  <button
                    type="button"
                    aria-label={`${p.name} 삭제`}
                    onClick={() => {
                      deletePreset(p.id);
                      toast.success("프리셋을 삭제했습니다");
                    }}
                    className="mr-1 hidden rounded-sm p-1 text-muted hover:bg-surface-2 hover:text-text group-hover:block"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-1 border-t border-border pt-1">
            {saving ? (
              <form
                className="flex items-center gap-1 px-1 py-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveCurrentAsPreset(name);
                  toast.success("프리셋을 저장했습니다");
                  setName("");
                  setSaving(false);
                  setOpen(false);
                }}
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="프리셋 이름"
                  aria-label="프리셋 이름"
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
                현재 설정 저장…
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
