import { NormalizeOptions, Preset } from "../transform/types";

const BLOG: NormalizeOptions = {
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
  smartQuotes: true,
  convertTablesToText: true,
  trimTrailingSpaces: true,
};

const NOTE: NormalizeOptions = {
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

const PLAIN: NormalizeOptions = {
  stripEmoji: true,
  stripEmojiInHeadings: true,
  simplifyHeadings: true,
  maxHeadingDepth: 2,
  normalizeBold: true,
  unwrapListLeadBold: true,
  normalizeListMarker: true,
  normalizeOrderedList: true,
  removeHr: true,
  collapseBlankLines: true,
  smartQuotes: false,
  convertTablesToText: true,
  trimTrailingSpaces: true,
};

/** 대표 템플릿 3종 (= builtIn 프리셋). */
export const DEFAULT_PRESETS: Preset[] = [
  {
    id: "tpl-blog",
    name: "블로그 발행",
    icon: "pencil",
    tagline: "네이버·티스토리에 바로 붙여넣을 수 있게 다듬기",
    targets: ["네이버", "티스토리", "워드프레스"],
    recommended: true,
    options: BLOG,
    outputFormat: "blog",
    blogTarget: "naver",
    builtIn: true,
    createdAt: 0,
  },
  {
    id: "tpl-note",
    name: "깔끔한 메모",
    icon: "notebook-pen",
    tagline: "옵시디언·노션에 정리하기 좋게 마크다운 다듬기",
    targets: ["Obsidian", "Notion", "Bear"],
    options: NOTE,
    outputFormat: "plain",
    builtIn: true,
    createdAt: 0,
  },
  {
    id: "tpl-plain",
    name: "플레인 텍스트",
    icon: "align-left",
    tagline: "메신저·이메일·댓글에 붙일 순수 텍스트로",
    targets: ["카카오톡", "슬랙", "이메일"],
    options: PLAIN,
    outputFormat: "plain",
    builtIn: true,
    createdAt: 0,
  },
];

// 직전 사용 템플릿이 없을 때의 기본값: 메모
export const DEFAULT_PRESET_ID = "tpl-note";
