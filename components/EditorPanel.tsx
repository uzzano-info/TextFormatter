"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { useAppStore } from "@/store/useAppStore";

const DEBOUNCE_MS = 150;

export default function EditorPanel() {
  const input = useAppStore((s) => s.input);
  const setInput = useAppStore((s) => s.setInput);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 카운터는 store input 기준으로 표시
  const charCount = input.length;
  const lineCount = input ? input.split("\n").length : 0;

  useEffect(() => {
    if (!hostRef.current || viewRef.current) return;

    const updateListener = EditorView.updateListener.of((u) => {
      if (!u.docChanged) return;
      // IME 조합 중에는 반영하지 않는다 (조합 종료 후에만)
      if (u.view.composing) return;
      const value = u.state.doc.toString();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setInput(value);
      }, DEBOUNCE_MS);
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
          placeholder("AI 답변을 여기에 붙여넣으세요 (Ctrl/Cmd+V)"),
          updateListener,
          EditorView.theme({
            "&": { height: "100%", fontSize: "14px" },
            ".cm-scroller": {
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, monospace",
              overflow: "auto",
            },
            ".cm-content": { padding: "12px" },
          }),
          // IME 조합 종료 시 즉시 반영
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

    return () => {
      if (timer.current) clearTimeout(timer.current);
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 외부(예: sendOutputToInput)에서 input이 바뀌면 에디터 문서를 동기화
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
      <div ref={hostRef} className="min-h-0 flex-1 overflow-hidden" />
      <div className="flex justify-end gap-3 border-t border-slate-200 px-3 py-1 text-xs text-slate-500">
        <span>{charCount.toLocaleString()}자</span>
        <span>{lineCount.toLocaleString()}줄</span>
      </div>
    </div>
  );
}
