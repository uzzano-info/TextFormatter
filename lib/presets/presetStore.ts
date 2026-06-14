import { Preset, NormalizeOptions, OutputFormat, BlogTarget } from "../transform/types";

const PRESETS_KEY = "apf:presets:v1";
const LAST_STATE_KEY = "apf:lastState:v1";

export interface LastState {
  options: NormalizeOptions;
  outputFormat: OutputFormat;
  blogTarget: BlogTarget;
  activePresetId: string | null;
}

function safeLocalStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** 사용자 정의 프리셋 배열 로드 (빌트인 제외). 실패 시 빈 배열. */
export function loadUserPresets(): Preset[] {
  const ls = safeLocalStorage();
  if (!ls) return [];
  try {
    const raw = ls.getItem(PRESETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p): p is Preset => !!p && typeof p.id === "string");
  } catch {
    return [];
  }
}

export function saveUserPresets(presets: Preset[]): void {
  const ls = safeLocalStorage();
  if (!ls) return;
  try {
    // 빌트인은 저장하지 않는다
    ls.setItem(PRESETS_KEY, JSON.stringify(presets.filter((p) => !p.builtIn)));
  } catch {
    /* 용량 초과 등 무시 */
  }
}

export function loadLastState(): LastState | null {
  const ls = safeLocalStorage();
  if (!ls) return null;
  try {
    const raw = ls.getItem(LAST_STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LastState;
  } catch {
    return null;
  }
}

export function saveLastState(state: LastState): void {
  const ls = safeLocalStorage();
  if (!ls) return;
  try {
    ls.setItem(LAST_STATE_KEY, JSON.stringify(state));
  } catch {
    /* 무시 */
  }
}
