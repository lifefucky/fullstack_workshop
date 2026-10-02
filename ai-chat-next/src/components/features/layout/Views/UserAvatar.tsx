const letter = (name: string) => {
  const mark = Array.from(name.trim())[0] ?? "";
  return /^[\p{L}\p{N}]$/u.test(mark) ? mark.toUpperCase() : "";
};

export function UserAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initial = letter(name);
  const box = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";

  return (
    <span
      className={`flex items-center justify-center rounded-full bg-surface font-semibold text-ink ring-1 ring-line ${box}`}
    >
      {initial || (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M5 19.2c1.4-3 3.8-4.4 7-4.4s5.6 1.4 7 4.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  );
}
