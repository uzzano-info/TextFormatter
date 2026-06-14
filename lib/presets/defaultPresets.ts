import { DEFAULT_OPTIONS, NormalizeOptions, Preset } from "../transform/types";

function opts(overrides: Partial<NormalizeOptions>): NormalizeOptions {
  return { ...DEFAULT_OPTIONS, ...overrides };
}

/** 기본 제공 프리셋 3종. id는 고정(빌트인 식별용). */
export const DEFAULT_PRESETS: Preset[] = [
  {
    id: "builtin-clean-memo",
    name: "깔끔한 메모",
    builtIn: true,
    createdAt: 0,
    outputFormat: "markdown",
    options: opts({
      stripEmoji: true,
      simplifyHeadings: true,
      maxHeadingDepth: 3,
      normalizeBold: true,
      normalizeListMarker: true,
      normalizeOrderedList: true,
      removeHr: true,
      collapseBlankLines: true,
      trimTrailingSpaces: true,
    }),
  },
  {
    id: "builtin-blog",
    name: "블로그용",
    builtIn: true,
    createdAt: 0,
    outputFormat: "blog",
    blogTarget: "naver",
    options: opts({
      stripEmoji: true,
      // 헤더 유지(H2~H3): 단순화는 켜되 최대 깊이 3
      simplifyHeadings: true,
      maxHeadingDepth: 3,
      normalizeBold: true,
      normalizeListMarker: true,
      normalizeOrderedList: true,
      removeHr: true,
      convertTablesToText: true,
      collapseBlankLines: true,
      trimTrailingSpaces: true,
    }),
  },
  {
    id: "builtin-light",
    name: "원문 보존(라이트)",
    builtIn: true,
    createdAt: 0,
    outputFormat: "markdown",
    options: opts({
      stripEmoji: false,
      stripEmojiInHeadings: false,
      simplifyHeadings: false,
      normalizeBold: false,
      unwrapListLeadBold: false,
      normalizeListMarker: false,
      normalizeOrderedList: false,
      removeHr: false,
      smartQuotes: false,
      convertTablesToText: false,
      // 빈 줄 정리 + 줄끝 공백 제거만
      collapseBlankLines: true,
      trimTrailingSpaces: true,
    }),
  },
];

export const DEFAULT_PRESET_ID = "builtin-clean-memo";
