export const BRAND = {
  name: "Kingsperl",
  fullName: "Kingsperl Events",
  descriptor: "EVENTS",
  tagline: "Where atmosphere takes form.",
  siteUrl: "https://www.kingsperl.com",
} as const;

export function KingsperlMark({ className = "brand-mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" aria-hidden="true">
      <path d="M18 108V54C18 26 37 10 64 10s46 16 46 44v22" stroke="var(--acid)" strokeWidth="5" strokeLinecap="round" />
      <path d="M42 43v58m3-31 32-28M46 71l35 33" stroke="currentColor" strokeWidth="7" strokeLinecap="square" />
      <circle cx="105" cy="96" r="11" fill="currentColor" />
    </svg>
  );
}

export function BrandLockup() {
  return (
    <>
      <KingsperlMark />
      <span className="brand-words">
        <strong>{BRAND.name}</strong>
        <small>{BRAND.descriptor}</small>
      </span>
    </>
  );
}
