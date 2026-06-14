import { create } from "zustand";
import { nanoid } from "nanoid";
import {
  NormalizeOptions,
  OutputFormat,
  BlogTarget,
  SourceType,
  Preset,
} from "@/lib/transform/types";
import { runPipeline } from "@/lib/transform/runPipeline";
import { detectSource } from "@/lib/transform/detectSource";
import {
  computeStats,
  CleanupStats,
  EMPTY_STATS,
} from "@/lib/transform/computeStats";
import { sampleInput } from "@/lib/sampleInput";
import { Lang, DEFAULT_LANG, LANG_KEY, translate } from "@/lib/i18n";
import {
  DEFAULT_PRESETS,
  DEFAULT_PRESET_ID,
} from "@/lib/presets/defaultPresets";
import {
  loadUserPresets,
  saveUserPresets,
  loadLastState,
  saveLastState,
} from "@/lib/presets/presetStore";

interface AppState {
  input: string;
  detectedSource: SourceType;
  detectScore: number;
  options: NormalizeOptions;
  outputFormat: OutputFormat;
  blogTarget: BlogTarget;
  activePresetId: string | null; // 현재 기준 템플릿 (수정해도 유지)
  modified: boolean; // 기준 템플릿에서 옵션이 바뀌었는지
  presets: Preset[];

  viewMode: "clean" | "diff";
  optionsOpen: boolean; // 세부조정 드로어
  lang: Lang;

  // 파생 결과 (직접 set 금지 — recompute로만 갱신)
  output: string;
  warnedSimplified: boolean;
  fallback: boolean;
  stats: CleanupStats;

  setInput: (v: string) => void;
  setViewMode: (m: "clean" | "diff") => void;
  setOptionsOpen: (v: boolean) => void;
  setLang: (l: Lang) => void;
  loadSample: () => void;
  setOption: <K extends keyof NormalizeOptions>(
    key: K,
    value: NormalizeOptions[K],
  ) => void;
  setFormat: (f: OutputFormat) => void;
  setBlogTarget: (t: BlogTarget) => void;
  applyPreset: (id: string) => void;
  resetToTemplate: () => void;
  saveCurrentAsPreset: (name: string) => void;
  deletePreset: (id: string) => void;
  sendOutputToInput: () => void;
  hydrate: () => void;
}

const NOTE_PRESET =
  DEFAULT_PRESETS.find((p) => p.id === DEFAULT_PRESET_ID) ?? DEFAULT_PRESETS[0];

function compute(
  input: string,
  options: NormalizeOptions,
  format: OutputFormat,
  blogTarget: BlogTarget,
) {
  const r = runPipeline(input, options, format, blogTarget);
  return {
    output: r.output,
    warnedSimplified: r.warnedSimplified,
    fallback: r.fallback,
    stats: computeStats(input, options),
  };
}

function persist(s: AppState) {
  saveLastState({
    options: s.options,
    outputFormat: s.outputFormat,
    blogTarget: s.blogTarget,
    activePresetId: s.activePresetId,
  });
}

export const useAppStore = create<AppState>((set, get) => ({
  input: "",
  detectedSource: "unknown",
  detectScore: 0,
  options: NOTE_PRESET.options,
  outputFormat: NOTE_PRESET.outputFormat,
  blogTarget: NOTE_PRESET.blogTarget ?? "naver",
  activePresetId: DEFAULT_PRESET_ID,
  modified: false,
  presets: DEFAULT_PRESETS,
  viewMode: "clean",
  optionsOpen: true,
  lang: DEFAULT_LANG,
  output: "",
  warnedSimplified: false,
  fallback: false,
  stats: EMPTY_STATS,

  setViewMode: (m) => set({ viewMode: m }),
  setOptionsOpen: (v) => set({ optionsOpen: v }),

  setLang: (l) => {
    set({ lang: l });
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LANG_KEY, l);
        document.documentElement.lang = l;
      }
    } catch {
      /* ignore */
    }
  },

  loadSample: () => {
    get().setInput(sampleInput(get().lang));
  },

  setInput: (v) => {
    const { options, outputFormat, blogTarget } = get();
    const det = detectSource(v);
    set({
      input: v,
      detectedSource: det.source,
      detectScore: det.score,
      ...compute(v, options, outputFormat, blogTarget),
    });
  },

  setOption: (key, value) => {
    const next = { ...get().options, [key]: value };
    const { input, outputFormat, blogTarget } = get();
    set({
      options: next,
      modified: true, // 기준 템플릿에서 벗어남 (· 수정됨)
      ...compute(input, next, outputFormat, blogTarget),
    });
    persist(get());
  },

  setFormat: (f) => {
    const { input, options, blogTarget } = get();
    set({ outputFormat: f, ...compute(input, options, f, blogTarget) });
    persist(get());
  },

  setBlogTarget: (t) => {
    const { input, options, outputFormat } = get();
    set({ blogTarget: t, ...compute(input, options, outputFormat, t) });
    persist(get());
  },

  applyPreset: (id) => {
    const preset = get().presets.find((p) => p.id === id);
    if (!preset) return;
    const { input } = get();
    const format = preset.outputFormat;
    const blogTarget = preset.blogTarget ?? get().blogTarget;
    set({
      options: preset.options,
      outputFormat: format,
      blogTarget,
      activePresetId: id,
      modified: false,
      ...compute(input, preset.options, format, blogTarget),
    });
    persist(get());
  },

  resetToTemplate: () => {
    const id = get().activePresetId;
    if (id) get().applyPreset(id);
  },

  saveCurrentAsPreset: (name) => {
    const { options, outputFormat, blogTarget, presets, lang } = get();
    const preset: Preset = {
      id: nanoid(),
      name: name.trim() || translate(lang, "tmpl.defaultName"),
      icon: "star",
      tagline: translate(lang, "tmpl.defaultTagline"),
      targets: [],
      options,
      outputFormat,
      blogTarget,
      builtIn: false,
      createdAt: Date.now(),
    };
    const next = [...presets, preset];
    set({ presets: next, activePresetId: preset.id, modified: false });
    saveUserPresets(next);
    persist(get());
  },

  deletePreset: (id) => {
    const target = get().presets.find((p) => p.id === id);
    if (!target || target.builtIn) return; // 빌트인 삭제 불가
    const next = get().presets.filter((p) => p.id !== id);
    const wasActive = get().activePresetId === id;
    set({
      presets: next,
      activePresetId: wasActive ? DEFAULT_PRESET_ID : get().activePresetId,
    });
    if (wasActive) get().applyPreset(DEFAULT_PRESET_ID);
    saveUserPresets(next);
  },

  sendOutputToInput: () => {
    // 현재 markdown 출력을 input으로 복사 (단방향 편집)
    const { input, options, blogTarget } = get();
    const md = runPipeline(input, options, "markdown", blogTarget).output;
    get().setInput(md);
  },

  hydrate: () => {
    // 언어 복원 (기본 영어)
    try {
      if (typeof window !== "undefined") {
        const savedLang = localStorage.getItem(LANG_KEY);
        const lang: Lang = savedLang === "ko" ? "ko" : "en";
        set({ lang });
        document.documentElement.lang = lang;
      }
    } catch {
      /* ignore */
    }
    const userPresets = loadUserPresets();
    const presets = [...DEFAULT_PRESETS, ...userPresets];
    const last = loadLastState();
    if (last) {
      const { input } = get();
      const options = last.options ?? NOTE_PRESET.options;
      const outputFormat = last.outputFormat ?? NOTE_PRESET.outputFormat;
      const blogTarget = last.blogTarget ?? "naver";
      const activePresetId = last.activePresetId ?? DEFAULT_PRESET_ID;
      const base = presets.find((p) => p.id === activePresetId);
      const modified = base
        ? JSON.stringify(base.options) !== JSON.stringify(options)
        : true;
      set({
        presets,
        options,
        outputFormat,
        blogTarget,
        activePresetId,
        modified,
        ...compute(input, options, outputFormat, blogTarget),
      });
    } else {
      set({ presets });
    }
  },
}));
