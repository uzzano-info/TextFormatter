export type DiffOp = "equal" | "remove" | "add";

export interface DiffSegment {
  op: DiffOp;
  text: string;
}

/**
 * 토큰(공백 경계 보존) 단위 LCS diff.
 * 원문 → 결과 비교에서 제거(remove)/추가·변경(add)을 표시하기 위함.
 * 큰 입력은 비용이 크므로 호출 측에서 길이를 제한한다.
 */
export function wordDiff(before: string, after: string): DiffSegment[] {
  const a = tokenize(before);
  const b = tokenize(after);
  const n = a.length;
  const m = b.length;

  // LCS DP 테이블
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0),
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const segs: DiffSegment[] = [];
  let i = 0;
  let j = 0;
  const push = (op: DiffOp, text: string) => {
    const last = segs[segs.length - 1];
    if (last && last.op === op) last.text += text;
    else segs.push({ op, text });
  };

  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push("equal", a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push("remove", a[i]);
      i++;
    } else {
      push("add", b[j]);
      j++;
    }
  }
  while (i < n) push("remove", a[i++]);
  while (j < m) push("add", b[j++]);

  return segs;
}

/** 단어와 공백을 각각 토큰으로 보존해 자연스러운 diff 경계를 만든다. */
function tokenize(s: string): string[] {
  return s.match(/\s+|[^\s]+/g) ?? [];
}
