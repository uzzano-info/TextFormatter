export type SourceType = "chatgpt" | "claude" | "gemini" | "unknown";
export type OutputFormat = "markdown" | "html" | "plain" | "blog";
export type BlogTarget = "naver" | "tistory";

export interface NormalizeOptions {
  stripEmoji: boolean;
  stripEmojiInHeadings: boolean;
  simplifyHeadings: boolean;
  maxHeadingDepth: 2 | 3 | 4;
  normalizeBold: boolean;
  unwrapListLeadBold: boolean;
  normalizeListMarker: boolean;
  normalizeOrderedList: boolean;
  removeHr: boolean;
  collapseBlankLines: boolean;
  smartQuotes: boolean;
  convertTablesToText: boolean;
  trimTrailingSpaces: boolean;
}

export const DEFAULT_OPTIONS: NormalizeOptions = {
  stripEmoji: true,
  stripEmojiInHeadings: true,
  simplifyHeadings: true,
  maxHeadingDepth: 3,
  normalizeBold: true,
  unwrapListLeadBold: false,
  normalizeListMarker: true,
  normalizeOrderedList: true,
  removeHr: true,
  collapseBlankLines: true,
  smartQuotes: false,
  convertTablesToText: false,
  trimTrailingSpaces: true,
};

export interface Preset {
  id: string;
  name: string;
  options: NormalizeOptions;
  outputFormat: OutputFormat;
  blogTarget?: BlogTarget;
  builtIn: boolean;
  createdAt: number;
}

export interface DetectResult {
  source: SourceType;
  score: number; // 0~1 confidence
}
