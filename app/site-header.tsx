"use client";

import { useEffect, useRef, useState } from "react";
import { BrandLockup } from "./brand";

export default function SiteHeader({ onConsult, onBoard, boardCount = 0 }: {
  onConsult?: () => void;
  onBoard?: () => void;
  boardCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return <header className="modern-header">
    <a className="brand" href="/" aria-label="Kingsperl Events home"><BrandLockup /></a>
    <button ref={toggle} className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>
      <span /><span /><span />
    </button>
    <nav className={`modern-navigation ${open ? "is-open" : ""}`} id="main-navigation" aria-label="Main navigation">
      <a href="/events" onClick={() => setOpen(false)}>Discover</a>
      <a href="/#services" onClick={() => setOpen(false)}>What we do</a>
      <a href="/studio" onClick={() => setOpen(false)}>Design studio</a>
      <a href="/my-event" onClick={() => setOpen(false)}>My event</a>
    </nav>
    <div className="modern-header-actions">
      {onBoard && <button className="board-button" onClick={onBoard} aria-label={`Open inspiration board, ${boardCount} saved looks`}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z" stroke="currentColor" strokeWidth="1.5" /></svg><span>{boardCount}</span></button>}
      {onConsult ? <button className="modern-button header-consult" onClick={onConsult}>Let’s plan <span aria-hidden="true">↗</span></button> : <a className="modern-button header-consult" href="/?inquiry=1">Let’s plan <span aria-hidden="true">↗</span></a>}
    </div>
  </header>;
}
