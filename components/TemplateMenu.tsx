"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Check, Trash2, Save, RotateCcw } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";
import { templateMeta, Lang } from "@/lib/i18n";
import type { Preset } from "@/lib/transform/types";
import TemplateIcon from "./TemplateIcon";

function displayName(p: Preset, lang: Lang): string {
  return templateMeta(lang, p.id, {
    name: p.name,
    tagline: p.tagline,
    targets: p.targets,
  }).name;
}

export default function TemplateMenu() {
  const presets = useAppStore((s) => s.presets);
  const activePresetId = useAppStore((s) => s.activePresetId);
  const modified = useAppStore((s) => s.modified);
  const lang = useAppStore((s) => s.lang);
  const applyPreset = useAppStore((s) => s.applyPreset);
  const resetToTemplate = useAppStore((s) => s.resetToTemplate);
  const saveCurrentAsPreset = useAppStore((s) => s.saveCurrentAsPreset);
  const deletePreset = useAppStore((s) => s.deletePreset);
  const t = useT();

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
        aria-label={t("tmpl.aria")}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1.5 text-sm text-text transition-colors hover:bg-surface-2"
      >
        {active && (
          <TemplateIcon name={active.icon} size={15} className="text-accent" />
        )}
        <span>{active ? displayName(active, lang) : t("tmpl.fallback")}</span>
        {modified && <span className="text-xs text-muted">{t("tmpl.modified")}</span>}
        <ChevronDown size={14} className="text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-30 w-64 rounded-md border border-border bg-surface p-1 shadow-md">
          <Section
            items={builtIns}
            activeId={activePresetId}
            lang={lang}
            onPick={(id) => {
              applyPreset(id);
              setOpen(false);
            }}
          />

          {userTemplates.length > 0 && (
            <>
              <p className="px-2 pb-1 pt-2 text-[11px] font-semibold tracking-wide text-faint">
                {t("gallery.myTemplates")}
              </p>
              <Section
                items={userTemplates}
                activeId={activePresetId}
                lang={lang}
                onPick={(id) => {
                  applyPreset(id);
                  setOpen(false);
                }}
                onDelete={(id, nm) => {
                  deletePreset(id);
                  toast.success(t("toast.deleted", { name: nm }));
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
                  toast.success(t("toast.reset"));
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-text hover:bg-surface-2"
              >
                <RotateCcw size={14} className="text-muted" />
                {t("tmpl.reset")}
              </button>
            )}

            {saving ? (
              <form
                className="flex items-center gap-1 px-1 py-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveCurrentAsPreset(name);
                  toast.success(t("toast.saved"));
                  setName("");
                  setSaving(false);
                  setOpen(false);
                }}
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("tmpl.namePlaceholder")}
                  aria-label={t("tmpl.namePlaceholder")}
                  className="w-full rounded-sm border border-border bg-bg px-2 py-1 text-sm text-text"
                />
                <button
                  type="submit"
                  className="rounded-sm bg-accent px-2 py-1 text-sm text-on-accent hover:bg-accent-hover"
                >
                  {t("tmpl.saveBtn")}
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSaving(true)}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-text hover:bg-surface-2"
              >
                <Save size={14} className="text-muted" />
                {t("tmpl.save")}
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
  lang,
  onPick,
  onDelete,
}: {
  items: Preset[];
  activeId: string | null;
  lang: Lang;
  onPick: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
}) {
  return (
    <ul>
      {items.map((p) => {
        const nm = displayName(p, lang);
        return (
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
            <span className="flex-1 truncate">{nm}</span>
          </button>
          {onDelete && (
            <button
              type="button"
              aria-label={`${nm} delete`}
              onClick={() => onDelete(p.id, nm)}
              className="mr-1 hidden rounded-sm p-1 text-muted hover:bg-surface-2 hover:text-text group-hover:block"
            >
              <Trash2 size={14} />
            </button>
          )}
        </li>
        );
      })}
    </ul>
  );
}
