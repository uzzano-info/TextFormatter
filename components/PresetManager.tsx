"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";

export default function PresetManager() {
  const presets = useAppStore((s) => s.presets);
  const activePresetId = useAppStore((s) => s.activePresetId);
  const applyPreset = useAppStore((s) => s.applyPreset);
  const saveCurrentAsPreset = useAppStore((s) => s.saveCurrentAsPreset);
  const deletePreset = useAppStore((s) => s.deletePreset);

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  const active = presets.find((p) => p.id === activePresetId);

  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="프리셋 선택"
        value={activePresetId ?? ""}
        onChange={(e) => {
          if (e.target.value) applyPreset(e.target.value);
        }}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
      >
        {!activePresetId && <option value="">사용자 지정</option>}
        {presets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
            {p.builtIn ? "" : " ★"}
          </option>
        ))}
      </select>

      {active && !active.builtIn && (
        <button
          type="button"
          aria-label="선택한 프리셋 삭제"
          onClick={() => {
            deletePreset(active.id);
            toast.success("프리셋을 삭제했습니다");
          }}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
        >
          삭제
        </button>
      )}

      {saving ? (
        <form
          className="flex items-center gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            saveCurrentAsPreset(name);
            toast.success("프리셋을 저장했습니다");
            setName("");
            setSaving(false);
          }}
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="프리셋 이름"
            aria-label="프리셋 이름"
            className="w-32 rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-2 py-1 text-sm text-white hover:bg-slate-700"
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => {
              setSaving(false);
              setName("");
            }}
            className="rounded-md px-2 py-1 text-sm text-slate-500"
          >
            취소
          </button>
        </form>
      ) : (
        <button
          type="button"
          aria-label="현재 옵션을 프리셋으로 저장"
          onClick={() => setSaving(true)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700 hover:bg-slate-50"
        >
          프리셋 저장
        </button>
      )}
    </div>
  );
}
