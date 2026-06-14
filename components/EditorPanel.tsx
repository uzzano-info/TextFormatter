"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { toast } from "sonner";
import { ClipboardPaste, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";

const DEBOUNCE_MS = 150;

export default function EditorPanel() {
  const input = useAppStore((s) => s.input);
  const setInput = useAppStore((s) => s.setInput);
  const t = useT();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const charCount = input.length;
  const lineCount = input ? input.split("\n").length : 0;

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        viewRef.current?.focus();
      } else {
        viewRef.current?.focus();
      }
    } catch {
      viewRef.current?.focus();
      toast.error(t("toast.pasteFail"));
    }
  }

  function handleClear() {
    setInput("");
    viewRef.current?.focus();
  }

  useEffect(() => {
    if (!hostRef.current || viewRef.current) return;

    const updateListener = EditorView.updateListener.of((u) => {
      if (!u.docChanged) return;
      if (u.view.composing) return; // IME 조합 중 미반영
      const value = u.state.doc.toString();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setInput(value), DEBOUNCE_MS);
    });

    const view = new EditorView({
      parent: hostRef.current,
      state: EditorState.create({
        doc: useAppStore.getState().input,
        extensions: [
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          markdown(),
          EditorView.lineWrapping,
          updateListener,
          EditorView.theme({
            "&": {
              height: "100%",
              fontSize: "14px",
              color: "var(--text)",
              backgroundColor: "transparent",
            },
            ".cm-scroller": {
              fontFamily: "var(--font-mono)",
              lineHeight: "1.7",
              overflow: "auto",
            },
            ".cm-content": { padding: "24px", caretColor: "var(--accent)" },
            ".cm-cursor": { borderLeftColor: "var(--accent)" },
            "&.cm-focused": { outline: "none" },
            ".cm-selectionBackground, ::selection": {
              backgroundColor: "var(--accent-soft)",
            },
            ".cm-activeLine": { backgroundColor: "transparent" },
          }),
          EditorView.domEventHandlers({
            compositionend: (_e, view) => {
              if (timer.current) clearTimeout(timer.current);
              setInput(view.state.doc.toString());
              return false;
            },
          }),
        ],
      }),
    });
    viewRef.current = view;
    // 빈 상태로 시작하면 바로 붙여넣을 수 있도록 포커스
    if (!useAppStore.getState().input) view.focus();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 외부(예: 예시 로드, sendOutputToInput)에서 input 변경 시 동기화
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== input) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: input },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-[13px] font-semibold tracking-wide text-muted">
          {t("input.label")}
        </span>
        {input.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={t("input.clearAria")}
            className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            <X size={13} />
            {t("input.clear")}
          </button>
        )}
      </div>
      <div className="relative min-h-0 flex-1">
        <div ref={hostRef} className="h-full overflow-hidden" />
        {input.length === 0 && (
          <div className="absolute left-0 top-0 flex flex-col gap-3 p-6">
            <span className="pointer-events-none font-mono text-sm text-faint">
              {t("input.placeholder")}
            </span>
            <button
              type="button"
              onClick={handlePaste}
              className="inline-flex w-fit items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text transition-colors hover:bg-surface-2"
            >
              <ClipboardPaste size={15} className="text-accent" />
              {t("input.paste")}
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 px-4 py-2 text-xs text-faint">
        <span>{t("count.chars", { n: charCount.toLocaleString() })}</span>
        <span>{t("count.lines", { n: lineCount.toLocaleString() })}</span>
      </div>
    </div>
  );
}
