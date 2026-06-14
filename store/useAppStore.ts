import { create } from "zustand";
import { nanoid } from "nanoid";
import {
  DEFAULT_OPTIONS,
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
import { SAMPLE_INPUT } from "@/lib/sampleInput";
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
  activePresetId: string | null;
  presets: Preset[];

  viewMode: "clean" | "diff";

  // 파생 결과 (직접 set 금지 — recompute로만 갱신)
  output: string;
  warnedSimplified: boolean;
  fallback: boolean;
  stats: CleanupStats;

  setInput: (v: string) => void;
  setViewMode: (m: "clean" | "diff") => void;
  loadSample: () => void;
  setOption: <K extends keyof NormalizeOptions>(
    key: K,
    value: NormalizeOptions[K],
  ) => void;
  setFormat: (f: OutputFormat) => void;
  setBlogTarget: (t: BlogTarget) => void;
  applyPreset: (id: string) => void;
  saveCurrentAsPreset: (name: string) => void;
  deletePreset: (id: string) => void;
  sendOutputToInput: () => void;
  hydrate: () => void;
}

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
  options: DEFAULT_OPTIONS,
  outputFormat: "markdown",
  blogTarget: "naver",
  activePresetId: DEFAULT_PRESET_ID,
  presets: DEFAULT_PRESETS,
  viewMode: "clean",
  output: "",
  warnedSimplified: false,
  fallback: false,
  stats: EMPTY_STATS,

  setViewMode: (m) => set({ viewMode: m }),

  loadSample: () => {
    get().setInput(SAMPLE_INPUT);
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
      activePresetId: null, // 옵션을 손대면 프리셋에서 벗어남
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
      ...compute(input, preset.options, format, blogTarget),
    });
    persist(get());
  },

  saveCurrentAsPreset: (name) => {
    const { options, outputFormat, blogTarget, presets } = get();
    const preset: Preset = {
      id: nanoid(),
      name: name.trim() || "내 프리셋",
      options,
      outputFormat,
      blogTarget,
      builtIn: false,
      createdAt: Date.now(),
    };
    const next = [...presets, preset];
    set({ presets: next, activePresetId: preset.id });
    saveUserPresets(next);
    persist(get());
  },

  deletePreset: (id) => {
    const target = get().presets.find((p) => p.id === id);
    if (!target || target.builtIn) return; // 빌트인 삭제 불가
    const next = get().presets.filter((p) => p.id !== id);
    set({
      presets: next,
      activePresetId: get().activePresetId === id ? null : get().activePresetId,
    });
    saveUserPresets(next);
  },

  sendOutputToInput: () => {
    // 현재 markdown 출력을 input으로 복사 (단방향 편집)
    const { input, options, blogTarget } = get();
    const md = runPipeline(input, options, "markdown", blogTarget).output;
    get().setInput(md);
  },

  hydrate: () => {
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV !== "production"
    ) {
      // 개발용 디버그 핸들 (프로덕션 빌드에는 포함되지 않음)
      (window as unknown as { __appStore?: unknown }).__appStore = useAppStore;
    }
    const userPresets = loadUserPresets();
    const presets = [...DEFAULT_PRESETS, ...userPresets];
    const last = loadLastState();
    if (last) {
      const { input } = get();
      set({
        presets,
        options: last.options ?? DEFAULT_OPTIONS,
        outputFormat: last.outputFormat ?? "markdown",
        blogTarget: last.blogTarget ?? "naver",
        activePresetId: last.activePresetId ?? null,
        ...compute(
          input,
          last.options ?? DEFAULT_OPTIONS,
          last.outputFormat ?? "markdown",
          last.blogTarget ?? "naver",
        ),
      });
    } else {
      set({ presets });
    }
  },
}));
