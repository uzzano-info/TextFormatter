"use client";

import {
  Pencil,
  NotebookPen,
  AlignLeft,
  Star,
  FileText,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  pencil: Pencil,
  "notebook-pen": NotebookPen,
  "align-left": AlignLeft,
  star: Star,
};

export default function TemplateIcon({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = MAP[name] ?? FileText;
  return <Icon size={size} className={className} strokeWidth={1.5} />;
}
