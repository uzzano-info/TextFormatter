"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Download, ChevronDown, CornerUpLeft } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";
import type { OutputFormat } from "@/lib/transform/types";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const EXPORTS: { ext: string; mime: string; labelKey: string }[] = [
  { ext: "md", mime: "text/markdown", labelKey: "export.md" },
  { ext: "txt", mime: "text/plain", labelKey: "export.txt" },
  { ext: "html", mime: "text/html", labelKey: "export.html" },
];

export default function CopyExportButtons() {
  const output = useAppStore((s) => s.output);
  const outputFormat = useAppStore((s) => s.outputFormat);
  const sendOutputToInput = useAppStore((s) => s.sendOutputToInput);
  const t = useT();
  const disabled = output.trim().length === 0;

  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  // ⌘/Ctrl+C 로 결과 복사 (입력 포커스가 아닐 때)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
        const sel = window.getSelection()?.toString();
        const inEditor = (e.target as HTMLElement)?.closest?.(".cm-editor");
        if (!sel && !inEditor && !disabled) {
          e.preventDefault();
          void handleCopy();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [output, outputFormat, disabled]);

  async function handleCopy() {
    try {
      if (outputFormat === "html" && typeof ClipboardItem !== "undefined") {
        const item = new ClipboardItem({
          "text/html": new Blob([output], { type: "text/html" }),
          "text/plain": new Blob([output], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(output);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("toast.copyFail"));
    }
  }

  function handleExport(fmt: { ext: string; mime: string }) {
    download(`formatted.${fmt.ext}`, output, `${fmt.mime};charset=utf-8`);
    toast.success(t("toast.exported", { ext: fmt.ext }));
    setMenuOpen(false);
  }

  // 현재 포맷에 맞는 기본 확장자를 목록 맨 앞으로
  const defaultExt: Record<OutputFormat, string> = {
    markdown: "md",
    html: "html",
    plain: "txt",
    blog: "txt",
  };
  const ordered = [...EXPORTS].sort((a, b) =>
    a.ext === defaultExt[outputFormat]
      ? -1
      : b.ext === defaultExt[outputFormat]
        ? 1
        : 0,
  );

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={t("action.copyAria")}
        onClick={handleCopy}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 rounded-sm bg-accent px-3 py-1.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? t("action.copied") : t("action.copy")}
      </button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-label={t("action.exportAria")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          disabled={disabled}
          className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface px-3 py-1.5 text-sm text-text transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={15} />
          {t("action.export")}
          <ChevronDown size={13} className="text-muted" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-10 z-20 w-44 rounded-md border border-border bg-surface p-1 shadow-md">
            {ordered.map((f) => (
              <button
                key={f.ext}
                type="button"
                onClick={() => handleExport(f)}
                className="block w-full rounded-sm px-2 py-1.5 text-left text-sm text-text hover:bg-surface-2"
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label={t("action.sendToInputAria")}
        onClick={sendOutputToInput}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
      >
        <CornerUpLeft size={15} />
        {t("action.sendToInput")}
      </button>
    </div>
  );
}
