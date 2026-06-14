import type { DetectResult } from "./types";

/**
 * 입력 텍스트의 특징으로 어느 AI 출력인지 추정한다.
 * 단순 신호 점수 합산. 과적합하지 않는다. 실패 시 'unknown'.
 * 감지는 기본 프리셋 자동 선택에만 쓰이며, 틀려도 기능은 정상 동작한다.
 */
export function detectSource(input: string): DetectResult {
  const text = input ?? "";
  if (!text.trim()) return { source: "unknown", score: 0 };

  const lines = text.split("\n");
  const emojiRe = /\p{Extended_Pictographic}/u;

  const boldCount = (text.match(/\*\*[^*]+\*\*/g) ?? []).length;
  const h3Count = (text.match(/^#{3,}\s/gm) ?? []).length;
  const hrCount = (text.match(/^(?:---|\*\*\*|___)\s*$/gm) ?? []).length;
  const dashBullets = (text.match(/^\s*-\s+/gm) ?? []).length;
  const starBullets = (text.match(/^\s*\*\s+/gm) ?? []).length;
  const leadBold = (text.match(/^\s*[-*]\s+\*\*[^*]+\*\*\s*[:：]/gm) ?? []).length;
  const tableRows = (text.match(/^\s*\|.*\|\s*$/gm) ?? []).length;
  const emojiHeadings = lines.filter(
    (l) => /^#{1,6}\s/.test(l) && emojiRe.test(l),
  ).length;
  const emojiTotal = (text.match(/\p{Extended_Pictographic}/gu) ?? []).length;

  const scores: Record<"chatgpt" | "claude" | "gemini", number> = {
    chatgpt: 0,
    claude: 0,
    gemini: 0,
  };

  // ChatGPT: 과한 bold, ### 남발, 구분선 빈번, 리드 bold, 이모지 섹션 헤더
  scores.chatgpt += Math.min(boldCount, 5) * 0.6;
  scores.chatgpt += Math.min(h3Count, 5) * 0.6;
  scores.chatgpt += Math.min(hrCount, 3) * 1.0;
  scores.chatgpt += Math.min(leadBold, 4) * 1.2;
  scores.chatgpt += Math.min(emojiHeadings, 3) * 1.0;

  // Claude: 정돈된 헤더(이모지 적음), 표 사용
  scores.claude += Math.min(tableRows, 6) * 0.8;
  scores.claude += h3Count > 0 && emojiTotal === 0 ? 2 : 0;
  scores.claude += emojiTotal === 0 ? 1 : 0;

  // Gemini: * 불릿, 굵은 소제목, 이모지 산발적
  scores.gemini += Math.min(starBullets, 6) * 0.9;
  scores.gemini += starBullets > dashBullets ? 1.5 : 0;
  scores.gemini += emojiTotal > 0 && emojiTotal <= 3 ? 1 : 0;

  const entries = Object.entries(scores) as [
    "chatgpt" | "claude" | "gemini",
    number,
  ][];
  entries.sort((a, b) => b[1] - a[1]);
  const [topSource, topScore] = entries[0];
  const total = entries.reduce((s, [, v]) => s + v, 0);

  // 신뢰도가 낮으면 unknown
  if (topScore < 2 || total === 0) {
    return { source: "unknown", score: Number((topScore / 6).toFixed(2)) };
  }
  const confidence = Math.min(1, topScore / (total || 1));
  return { source: topSource, score: Number(confidence.toFixed(2)) };
}
