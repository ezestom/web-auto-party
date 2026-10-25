"use client";

import { useLanguage } from "./language";
import { useRef, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navigation } from "./content";
import GlideSelect from "./GlideSelect";

export function WelcomeNavigation() {
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  return (
    <header className="ap-header" onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }}>
      <div className="ap-nav-inner">
        <a className="ap-brand" href="#top" aria-label={t("AutoParty home")} onClick={() => setOpen(false)}>
          <Image src="/autoparty-logo.png" alt="" width={520} height={576} className="ap-brand-logo" priority />
          <span className="ap-wordmark"><span className="ap-wordmark-name">AutoParty <span className="ap-brand-beta">BETA</span></span><span className="ap-wordmark-tagline">{t("Your music. Party on.")}</span></span>
        </a>
        <nav className="ap-desktop-nav" aria-label={t("Main navigation")}>
          {navigation.map((item) => <a key={item.href} href={item.href}>{t(item.label)}</a>)}
        </nav>
        <div className="ap-nav-actions">
          <GlideSelect
            className="ap-language"
            options={[{ value: "en", label: "EN", tag: "English" }, { value: "es", label: "ES", tag: "Castellano" }]}
            value={language}
            onChange={(value: string) => setLanguage(value === "es" ? "es" : "en")}
            ariaLabel={t("Language")}
            size="lg"
            radius={12}
            menuWidth={184}
            align="right"
            surfaceColor="#171719"
            highlightColor="#343438"
            accentColor="#64dce8"
          />
          <button ref={toggle} type="button" className="ap-menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={t(open ? "Close menu" : "Open menu")} onClick={() => setOpen(!open)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" className="ap-mobile-nav" aria-label={t("Mobile navigation")} hidden={!open}>
        {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{t(item.label)}</a>)}
      </nav>
    </header>
  );
}
