export type Lang = "en" | "ko";
export const DEFAULT_LANG: Lang = "en";
export const LANG_KEY = "apf:lang";

type Dict = Record<string, string>;

const en: Dict = {
  // topbar / detect
  "detect.badge": "AI answer format detected",
  "detect.tooltip": "Estimated {src} style (for reference)",
  "tune": "Adjust",
  "theme.toLight": "Switch to light mode",
  "theme.toDark": "Switch to dark mode",
  "lang.aria": "Language",
  "help.aria": "Help",
  "help.title": "This tool tidies the heavy formatting and emoji in AI answers.",
  "help.paste": "paste on the left",
  "help.copy": "copy result (when not focused in the editor)",
  "help.privacy": "Everything is processed inside your browser only.",
  // editor
  "input.label": "INPUT",
  "input.placeholder": "Paste an AI answer here (⌘V)",
  "count.chars": "{n} chars",
  "count.lines": "{n} lines",
  // gallery
  "gallery.heading": "Pick where you'll use it",
  "gallery.sub":
    "Paste on the left and it's cleaned instantly. Pick a purpose for a better fit.",
  "gallery.myTemplates": "My templates",
  "gallery.trySample": "Try an example",
  "card.recommended": "Recommended",
  "card.selectAria": "Select the {name} template",
  // result
  "result.label": "RESULT",
  "result.clean": "Result",
  "result.diff": "Changes",
  "result.placeholder": "The cleaned-up result appears here",
  "result.showHtml": "View HTML code",
  "result.showPreview": "View preview",
  "toast.simplified": "Some formatting was simplified",
  "toast.fallback": "Conversion failed — showing the original text",
  // tabs
  "tab.markdown": "Markdown",
  "tab.html": "HTML",
  "tab.plain": "Plain",
  "tab.blog": "Blog",
  "tab.formatAria": "{label} format",
  "target.naver": "Naver",
  "target.tistory": "Tistory",
  // actions
  "action.copy": "Copy",
  "action.copied": "Copied",
  "action.copyAria": "Copy result",
  "action.export": "Export",
  "action.exportAria": "Export to file",
  "action.sendToInput": "Send to input",
  "action.sendToInputAria": "Send result to input",
  "export.md": "Markdown (.md)",
  "export.txt": "Plain (.txt)",
  "export.html": "HTML (.html)",
  "toast.copyFail": "Failed to copy",
  "toast.exported": "Exported a .{ext} file",
  // summary chips
  "summary.aria": "Cleanup summary",
  "chip.emoji": "Emoji −{n}",
  "chip.headings": "Headings {n}",
  "chip.hr": "Dividers −{n}",
  "chip.bold": "Bold {n}",
  "chip.list": "Lists {n}",
  // diff
  "diff.caption": "Shows what was cleaned up from the original",
  "diff.remove": "removed",
  "diff.change": "changed",
  "diff.removeAria": "Removed: {text}",
  "diff.changeAria": "Changed: {text}",
  "diff.tooLong": "Input is too long for Changes view. Use Result view.",
  // options
  "opt.group.clean": "Clean up",
  "opt.group.structure": "Structure",
  "opt.group.refine": "Refine",
  "opt.stripEmoji": "Remove emoji",
  "opt.stripEmojiInHeadings": "Remove emoji in headings only",
  "opt.normalizeBold": "Tidy bold",
  "opt.unwrapListLeadBold": "Unbold list leads",
  "opt.removeHr": "Remove dividers",
  "opt.simplifyHeadings": "Tidy headings",
  "opt.normalizeListMarker": "Unify bullets (-)",
  "opt.normalizeOrderedList": "Renumber lists",
  "opt.collapseBlankLines": "Collapse blank lines",
  "opt.trimTrailingSpaces": "Trim trailing spaces",
  "opt.smartQuotes": "Curly quotes",
  "opt.convertTablesToText": "Tables → text",
  "opt.maxDepth": "Max heading depth",
  "drawer.title": "Adjust",
  "drawer.close": "Close adjust panel",
  // template menu
  "tmpl.aria": "Select template",
  "tmpl.fallback": "Template",
  "tmpl.modified": "· edited",
  "tmpl.reset": "Reset to default",
  "tmpl.save": "Save as my template…",
  "tmpl.namePlaceholder": "Template name",
  "tmpl.saveBtn": "Save",
  "tmpl.deleteAria": "Delete {name}",
  "tmpl.defaultName": "My template",
  "tmpl.defaultTagline": "Template I saved",
  "toast.saved": "Saved as your template",
  "toast.reset": "Reset to the template default",
  "toast.deleted": "Deleted the '{name}' template",
  // footer
  "footer.privacy":
    "Everything is processed inside your browser. Your text is never sent or stored anywhere.",
  "footer.contact": "Contact",
};

const ko: Dict = {
  "detect.badge": "AI 답변 형식 감지됨",
  "detect.tooltip": "{src} 스타일로 추정 (참고용)",
  "tune": "세부조정",
  "theme.toLight": "라이트 모드로 전환",
  "theme.toDark": "다크 모드로 전환",
  "lang.aria": "언어",
  "help.aria": "도움말",
  "help.title": "이 도구는 AI 답변의 과한 서식·이모지를 정리합니다.",
  "help.paste": "왼쪽에 붙여넣기",
  "help.copy": "결과 복사 (입력 포커스가 아닐 때)",
  "help.privacy": "모든 변환은 브라우저 안에서만 처리됩니다.",
  "input.label": "INPUT",
  "input.placeholder": "AI 답변을 여기에 붙여넣으세요 (⌘V)",
  "count.chars": "{n}자",
  "count.lines": "{n}줄",
  "gallery.heading": "어디에 쓸지 고르세요",
  "gallery.sub":
    "왼쪽에 붙여넣으면 바로 정리해 드려요. 용도를 고르면 더 알맞게 다듬어요.",
  "gallery.myTemplates": "내 템플릿",
  "gallery.trySample": "예시로 체험하기",
  "card.recommended": "추천",
  "card.selectAria": "{name} 템플릿 선택",
  "result.label": "RESULT",
  "result.clean": "결과 보기",
  "result.diff": "변화 보기",
  "result.placeholder": "정리된 결과가 여기에 나타납니다",
  "result.showHtml": "HTML 코드 보기",
  "result.showPreview": "미리보기 보기",
  "toast.simplified": "일부 서식은 단순화되었어요",
  "toast.fallback": "변환에 실패해 원문을 그대로 표시합니다",
  "tab.markdown": "Markdown",
  "tab.html": "HTML",
  "tab.plain": "Plain",
  "tab.blog": "블로그",
  "tab.formatAria": "{label} 포맷",
  "target.naver": "네이버",
  "target.tistory": "티스토리",
  "action.copy": "복사",
  "action.copied": "복사됨",
  "action.copyAria": "결과 복사",
  "action.export": "내보내기",
  "action.exportAria": "파일로 내보내기",
  "action.sendToInput": "입력으로 보내기",
  "action.sendToInputAria": "결과를 입력으로 보내기",
  "export.md": "Markdown (.md)",
  "export.txt": "Plain (.txt)",
  "export.html": "HTML (.html)",
  "toast.copyFail": "복사에 실패했습니다",
  "toast.exported": ".{ext} 파일을 내보냈습니다",
  "summary.aria": "정리 요약",
  "chip.emoji": "이모지 −{n}",
  "chip.headings": "헤더 정리 {n}",
  "chip.hr": "구분선 −{n}",
  "chip.bold": "굵게 정리 {n}",
  "chip.list": "리스트 정리 {n}",
  "diff.caption": "원문에서 무엇이 정리됐는지 보여줍니다",
  "diff.remove": "제거",
  "diff.change": "변경",
  "diff.removeAria": "제거됨: {text}",
  "diff.changeAria": "변경됨: {text}",
  "diff.tooLong": "입력이 너무 길어 변화 보기를 건너뜁니다. 결과 보기를 사용하세요.",
  "opt.group.clean": "정리",
  "opt.group.structure": "구조",
  "opt.group.refine": "다듬기",
  "opt.stripEmoji": "이모지 제거",
  "opt.stripEmojiInHeadings": "헤더 이모지만 제거",
  "opt.normalizeBold": "굵게 정리",
  "opt.unwrapListLeadBold": "리스트 리드 굵게 해제",
  "opt.removeHr": "구분선 제거",
  "opt.simplifyHeadings": "헤더 정리",
  "opt.normalizeListMarker": "불릿 통일 (-)",
  "opt.normalizeOrderedList": "번호 재정렬",
  "opt.collapseBlankLines": "빈 줄 축소",
  "opt.trimTrailingSpaces": "줄끝 공백 제거",
  "opt.smartQuotes": "둥근 따옴표",
  "opt.convertTablesToText": "표 → 텍스트",
  "opt.maxDepth": "최대 헤더 깊이",
  "drawer.title": "세부조정",
  "drawer.close": "세부조정 닫기",
  "tmpl.aria": "템플릿 선택",
  "tmpl.fallback": "템플릿",
  "tmpl.modified": "· 수정됨",
  "tmpl.reset": "기본값으로 되돌리기",
  "tmpl.save": "내 템플릿으로 저장…",
  "tmpl.namePlaceholder": "템플릿 이름",
  "tmpl.saveBtn": "저장",
  "tmpl.deleteAria": "{name} 삭제",
  "tmpl.defaultName": "내 템플릿",
  "tmpl.defaultTagline": "내가 저장한 템플릿",
  "toast.saved": "내 템플릿으로 저장했습니다",
  "toast.reset": "템플릿 기본값으로 되돌렸습니다",
  "toast.deleted": "'{name}' 템플릿을 삭제했습니다",
  "footer.privacy":
    "이 도구의 모든 변환은 당신의 브라우저 안에서만 처리됩니다. 입력한 텍스트는 어디에도 전송·저장되지 않습니다.",
  "footer.contact": "문의",
};

const DICT: Record<Lang, Dict> = { en, ko };

export function translate(
  lang: Lang,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const template = DICT[lang][key] ?? DICT.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    vars && k in vars ? String(vars[k]) : "",
  );
}

// 빌트인 템플릿 현지화 (id 기준). 사용자 템플릿은 저장된 값 사용.
interface TemplateMeta {
  name: string;
  tagline: string;
  targets: string[];
}
const TEMPLATE_I18N: Record<string, Record<Lang, TemplateMeta>> = {
  "tpl-blog": {
    en: {
      name: "Blog publishing",
      tagline: "Clean up to paste straight into Naver/Tistory",
      targets: ["Naver", "Tistory", "WordPress"],
    },
    ko: {
      name: "블로그 발행",
      tagline: "네이버·티스토리에 바로 붙여넣을 수 있게 다듬기",
      targets: ["네이버", "티스토리", "워드프레스"],
    },
  },
  "tpl-note": {
    en: {
      name: "Clean note",
      tagline: "Tidy markdown for Obsidian/Notion",
      targets: ["Obsidian", "Notion", "Bear"],
    },
    ko: {
      name: "깔끔한 메모",
      tagline: "옵시디언·노션에 정리하기 좋게 마크다운 다듬기",
      targets: ["Obsidian", "Notion", "Bear"],
    },
  },
  "tpl-plain": {
    en: {
      name: "Plain text",
      tagline: "Pure text for messengers, email, comments",
      targets: ["KakaoTalk", "Slack", "Email"],
    },
    ko: {
      name: "플레인 텍스트",
      tagline: "메신저·이메일·댓글에 붙일 순수 텍스트로",
      targets: ["카카오톡", "슬랙", "이메일"],
    },
  },
};

export function templateMeta(
  lang: Lang,
  id: string,
  fallback: TemplateMeta,
): TemplateMeta {
  return TEMPLATE_I18N[id]?.[lang] ?? fallback;
}
