# 정제기 — AI Text Formatter

여러 AI 서비스(ChatGPT, Claude, Gemini 등)가 출력한 텍스트를 붙여넣으면, 과한
마크다운·이모지·서식을 정리하고 사용자 스타일로 정규화하여 블로그/메모/플레인텍스트
등 원하는 포맷으로 내보내는 **웹 기반 편집기**입니다.

모든 변환은 **브라우저 안에서만** 처리됩니다. 입력한 텍스트는 어디에도
전송·저장되지 않습니다 (백엔드/DB/로그인 없음).

## 기능

- 붙여넣기 → 자동 소스 감지 → 정규화 결과 실시간 미리보기
- 정규화 옵션 토글 (이모지 제거, 헤더 단순화, 굵게 정리, 구분선 제거 등)
- 출력 포맷 4종: **Markdown / Rich Text(HTML) / Plain Text / 블로그(네이버·티스토리)**
- 복사(HTML은 서식 유지) · 파일 내보내기(.md/.txt/.html)
- "결과를 입력으로 보내기" (단방향 편집)
- 프리셋 저장/적용/삭제 (기본 3종 + 사용자 정의, localStorage 영속화)

## 기술 스택

Next.js 14 (App Router) · TypeScript(strict) · Tailwind CSS · CodeMirror 6 ·
unified/remark/rehype · Zustand · Vitest

## 아키텍처

변환 파이프라인은 `lib/transform/`의 순수 함수로 구성됩니다 (DOM/React 비의존).

```
입력 → detectSource → parseToAst → normalize(AST 규칙) → serialize → postProcess → 출력
```

- **AST 변환 중심**: 정규식으로 마크다운을 직접 치환하지 않고, remark로 mdast(AST)를
  만든 뒤 노드 단위로 변환합니다. (이모지 탐지 등에만 정규식 보조 사용)
- **공백 정리**(빈 줄 축소/줄끝 공백 제거)는 AST 규칙이 아니라 직렬화 이후
  문자열 후처리(`postProcess.ts`)에서 처리합니다.
- 규칙은 `1 규칙 = 1 파일 = 1 순수 함수 (ast, opts) => ast` 구조 (`lib/transform/rules/`).

## 개발

> Node가 Homebrew로 설치된 환경에서는 PATH가 필요할 수 있습니다:
> `export PATH="/opt/homebrew/bin:$PATH"`

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm test         # 단위/스냅샷 테스트 (Vitest)
npm run typecheck
```

## 테스트

- **규칙별 단위 테스트**: AST 레벨 단언 우선 (정상/경계/비활성 케이스).
- **골든 스냅샷**: `tests/fixtures/`의 ChatGPT/Claude/Gemini 샘플을 기본 프리셋으로
  변환한 결과를 스냅샷으로 고정.
- 스냅샷 갱신: `npm test -- -u`

## 디렉터리

```
app/                  단일 페이지 + 레이아웃
components/            EditorPanel, PreviewPanel, OptionsBar, OutputFormatTabs,
                      CopyExportButtons, PresetManager
lib/transform/        변환 엔진 (parseToAst, normalize, serialize, postProcess,
                      runPipeline, detectSource, rules/)
lib/presets/          기본 프리셋 + localStorage
lib/export/           toBlog (네이버/티스토리)
store/                Zustand 전역 상태
tests/                단위/스냅샷/골든 테스트
```

## 알려진 한계

- HTML로 붙여넣은 입력의 mdast 역변환은 무손실이 아닙니다. 복잡한 표(colspan/rowspan),
  중첩 인라인 스타일, `<div>` 레이아웃 등은 단순화될 수 있습니다(설계상 한계).
  손실 위험이 큰 구조가 감지되면 "일부 서식은 단순화되었습니다" 경고만 표시합니다.
