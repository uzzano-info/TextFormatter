"use client";

import { Languages } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";

export default function LanguageToggle() {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const t = useT();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "ko" : "en")}
      aria-label={t("lang.aria")}
      title={t("lang.aria")}
      className="flex h-8 items-center gap-1 rounded-sm px-2 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text"
    >
      <Languages size={16} />
      {lang === "en" ? "EN" : "한"}
    </button>
  );
}
