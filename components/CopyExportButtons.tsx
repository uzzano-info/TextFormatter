"use client";

import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";

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

export default function CopyExportButtons() {
  const output = useAppStore((s) => s.output);
  const outputFormat = useAppStore((s) => s.outputFormat);
  const sendOutputToInput = useAppStore((s) => s.sendOutputToInput);
  const disabled = output.trim().length === 0;

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
      toast.success("복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  }

  function handleExport() {
    const map = {
      markdown: { ext: "md", mime: "text/markdown" },
      html: { ext: "html", mime: "text/html" },
      plain: { ext: "txt", mime: "text/plain" },
      blog: { ext: "txt", mime: "text/plain" },
    } as const;
    const { ext, mime } = map[outputFormat];
    download(`formatted.${ext}`, output, `${mime};charset=utf-8`);
    toast.success(`.${ext} 파일을 내보냈습니다`);
  }

  const btn =
    "rounded-md border px-3 py-1 text-sm transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label="결과 복사"
        onClick={handleCopy}
        disabled={disabled}
        className={`${btn} border-slate-900 bg-slate-900 text-white hover:bg-slate-700`}
      >
        복사
      </button>
      <button
        type="button"
        aria-label="파일로 내보내기"
        onClick={handleExport}
        disabled={disabled}
        className={`${btn} border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}
      >
        내보내기
      </button>
      <button
        type="button"
        aria-label="결과를 입력으로 보내기"
        onClick={sendOutputToInput}
        disabled={disabled}
        className={`${btn} border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}
      >
        입력으로 보내기
      </button>
    </div>
  );
}
