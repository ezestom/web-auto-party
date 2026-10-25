"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { APP_URL, navigation } from "./content";

export function WelcomeNavigation() {
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
        <a className="ap-brand" href="#top" aria-label="AutoParty home" onClick={() => setOpen(false)}>
          <Image src="/autoparty-logo.png" alt="" width={520} height={576} className="ap-brand-logo" priority />AutoParty<span className="ap-beta">BETA</span>
        </a>
        <nav className="ap-desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="ap-nav-actions">
          <a href={APP_URL} className="ap-button ap-button-small">Open AutoParty <ArrowUpRight aria-hidden="true" /></a>
          <button ref={toggle} type="button" className="ap-menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" className="ap-mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
      </nav>
    </header>
  );
}
