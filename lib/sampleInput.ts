import type { Lang } from "./i18n";

/** Empty state "Try an example"용 샘플 (전형적인 ChatGPT 스타일). */
const SAMPLE_KO = `## 🚀 React로 할 일 앱 만들기

안녕하세요! 오늘은 **아주 쉽게** React 할 일 앱을 만들어볼게요. 😊

### 📦 준비물

- **Node.js**: 최신 LTS 버전이 필요해요
- **에디터**: VS Code를 추천합니다 ✨
- **터미널**: 기본 터미널이면 충분해요

---

### 🛠️ 시작하기

1. 프로젝트를 생성합니다
3. 의존성을 설치합니다
7. 개발 서버를 실행합니다

**여기까지 따라오셨다면 절반은 성공입니다!** 🎉

---

자, 이제 시작해볼까요? 💪
`;

const SAMPLE_EN = `## 🚀 Building a To-Do App with React

Hi there! Today we'll build a React to-do app **super easily**. 😊

### 📦 What you'll need

- **Node.js**: the latest LTS version
- **Editor**: VS Code is recommended ✨
- **Terminal**: the default terminal is fine

---

### 🛠️ Getting started

1. Create the project
3. Install dependencies
7. Run the dev server

**If you've made it this far, you're halfway done!** 🎉

---

Alright, shall we begin? 💪
`;

export function sampleInput(lang: Lang): string {
  return lang === "ko" ? SAMPLE_KO : SAMPLE_EN;
}
