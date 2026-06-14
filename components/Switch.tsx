"use client";

interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hideLabel?: boolean;
}

export default function Switch({
  checked,
  onChange,
  label,
  hideLabel = false,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-sm text-text"
    >
      <span
        className={`relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-border-strong"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-[15px]" : "translate-x-[2px]"
          }`}
        />
      </span>
      {!hideLabel && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}
