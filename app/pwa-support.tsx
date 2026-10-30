"use client";

import { UIIcon } from "./ui-icon";


import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type AppState = { installed: boolean; ios: boolean; canPrompt: boolean; workerReady: boolean; install: () => Promise<void> };
const AppContext = createContext<AppState>({ installed: false, ios: false, canPrompt: false, workerReady: false, install: async () => {} });

export function PwaSupport({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const [workerReady, setWorkerReady] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    const syncDisplay = () => setInstalled(standalone.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    syncDisplay();
    setIos(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    const onPrompt = (event: Event) => { event.preventDefault(); setPrompt(event as InstallEvent); };
    const onInstalled = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    standalone.addEventListener("change", syncDisplay);
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then(() => navigator.serviceWorker.ready)
        .then(() => setWorkerReady(true))
        .catch(() => setWorkerReady(false));
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      standalone.removeEventListener("change", syncDisplay);
    };
  }, []);

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    setPrompt(null);
    if (outcome === "accepted") setInstalled(true);
  }

  return <AppContext.Provider value={{ installed, ios, canPrompt: Boolean(prompt), workerReady, install }}>{children}</AppContext.Provider>;
}

export function InstallPanel() {
  const { installed, ios, canPrompt, workerReady, install } = useContext(AppContext);
  return <section className="app-install-panel" id="main-content" tabIndex={-1}>
    <img src="/icon-192.png" width="96" height="96" alt="Kingsperl Events app icon" />
    <div>
      <p className="eyebrow">YOUR NEXT EVENT, CLOSER</p>
      <h1>Kingsperl Events.<br />At your fingertips.</h1>
      <p>Keep inspiration, your planning studio, and event ideas one tap away. Install Kingsperl Events on your phone or desktop.</p>
      {installed ? <p className="app-status" role="status">✓ Kingsperl Events is installed and ready.</p> : canPrompt ?
        <button className="solid-button" onClick={install}>Install Kingsperl Events <span aria-hidden="true"><UIIcon name="arrow-right" /></span></button> :
        <div className="app-install-instructions"><strong>{ios ? "Install on iPhone or iPad" : "Install from your browser"}</strong><p>{ios ? "Open this page in Safari, tap Share, then Add to Home Screen." : "Open your browser menu and choose Install app or Add to Home screen. On desktop Chrome or Edge, look for the install icon in the address bar."}</p></div>}
      <p className="app-note">{workerReady ? "Offline page ready." : "Open the app online once to prepare offline access."} Your event records and submissions always use a secure online connection.</p>
    </div>
  </section>;
}
