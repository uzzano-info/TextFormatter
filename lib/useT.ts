"use client";

import { useAppStore } from "@/store/useAppStore";
import { translate } from "@/lib/i18n";

/** 현재 언어로 UI 문자열을 반환하는 t 함수를 제공한다. */
export function useT() {
  const lang = useAppStore((s) => s.lang);
  return (key: string, vars?: Record<string, string | number>) =>
    translate(lang, key, vars);
}
