export type UIIconName = "arrow-right" | "arrow-down" | "grid" | "home" | "design" | "bookmark" | "calendar";

/** Drawn icons keep the same appearance on iOS, Android and desktop. */
export function UIIcon({ name, className = "" }: { name: UIIconName; className?: string }) {
  return <svg className={`ui-icon ${className}`.trim()} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === "arrow-right" && <path d="M5 12h14m-6-6 6 6-6 6" />}
    {name === "arrow-down" && <path d="M12 5v14m-6-6 6 6 6-6" />}
    {name === "grid" && <><rect x="3.5" y="3.5" width="6" height="6" rx="1.2" /><rect x="14.5" y="3.5" width="6" height="6" rx="1.2" /><rect x="3.5" y="14.5" width="6" height="6" rx="1.2" /><rect x="14.5" y="14.5" width="6" height="6" rx="1.2" /></>}
    {name === "home" && <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" /></>}
    {name === "design" && <><path d="m15 4 5 5M4 15 16.5 2.5a2.1 2.1 0 0 1 3 0l2 2a2.1 2.1 0 0 1 0 3L9 20l-6 1 1-6Z" /><path d="m4 15 5 5" /></>}
    {name === "bookmark" && <path d="M6 3.5h12v17l-6-4-6 4v-17Z" />}
    {name === "calendar" && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18m-9 3v5m-2.5-2.5h5" /></>}
  </svg>;
}
