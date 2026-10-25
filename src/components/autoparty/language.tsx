"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { spanish } from "./spanish";

type Language = "en" | "es";
const storageKey = "autoparty-language";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("autoparty-language", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("autoparty-language", callback);
  };
}
let selection: Language | undefined;
function snapshot(): Language {
  if (selection) return selection;
  try { return localStorage.getItem(storageKey) === "es" ? "es" : "en"; }
  catch { return "en"; }
}
type LanguageValue = { language: Language; setLanguage: (language: Language) => void; t: (text: string) => string };
const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, snapshot, () => "en" as const);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "es" ? "AutoParty — Tu música. Mezclada automáticamente." : "AutoParty — Your music. Automatically mixed.";
  }, [language]);
  function setLanguage(value: Language) {
    try { localStorage.setItem(storageKey, value); selection = undefined; }
    catch { selection = value; }
    window.dispatchEvent(new Event("autoparty-language"));
  }
  const t = (text: string) => language === "es" ? spanish[text] ?? text : text;
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("LanguageProvider is required for landing content.");
  return context;
}
