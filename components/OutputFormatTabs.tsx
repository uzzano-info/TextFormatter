"use client";

import { useAppStore } from "@/store/useAppStore";
import type { OutputFormat } from "@/lib/transform/types";

const TABS: { id: OutputFormat; label: string }[] = [
  { id: "markdown", label: "Markdown" },
  { id: "html", label: "HTML" },
  { id: "plain", label: "Plain" },
  { id: "blog", label: "블로그" },
];

export default function OutputFormatTabs() {
  const outputFormat = useAppStore((s) => s.outputFormat);
  const setFormat = useAppStore((s) => s.setFormat);
  const blogTarget = useAppStore((s) => s.blogTarget);
  const setBlogTarget = useAppStore((s) => s.setBlogTarget);

  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-md border border-slate-200 bg-slate-100 p-0.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-label={`${t.label} 포맷`}
            aria-pressed={outputFormat === t.id}
            onClick={() => setFormat(t.id)}
            className={`rounded px-3 py-1 text-sm transition ${
              outputFormat === t.id
                ? "bg-white font-medium text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {outputFormat === "blog" && (
        <select
          aria-label="블로그 대상 선택"
          value={blogTarget}
          onChange={(e) => setBlogTarget(e.target.value as "naver" | "tistory")}
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm"
        >
          <option value="naver">네이버</option>
          <option value="tistory">티스토리</option>
        </select>
      )}
    </div>
  );
}
