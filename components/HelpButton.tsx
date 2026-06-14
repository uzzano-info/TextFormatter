"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";
import { useT } from "@/lib/useT";

export default function HelpButton() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("help.aria")}
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
      >
        <HelpCircle size={18} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("help.aria")}
          className="absolute right-0 top-10 z-20 w-72 rounded-md border border-border bg-surface p-4 text-sm shadow-md"
        >
          <p className="mb-2 font-medium text-text">{t("help.title")}</p>
          <ul className="mb-3 space-y-1 text-muted">
            <li>
              <kbd className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-xs">
                ⌘V
              </kbd>{" "}
              {t("help.paste")}
            </li>
            <li>
              <kbd className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-xs">
                ⌘C
              </kbd>{" "}
              {t("help.copy")}
            </li>
          </ul>
          <p className="text-xs text-faint">{t("help.privacy")}</p>
          <p className="mt-2 border-t border-border pt-2 text-xs text-faint">
            made by uzzano ·{" "}
            <a
              href="mailto:uzzano.info@gmail.com"
              className="underline hover:text-text"
            >
              uzzano.info@gmail.com
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
