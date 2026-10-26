"use client";

import { useEffect, useState } from "react";
import Hyperspeed from "./Hyperspeed";

export function HeroHyperspeed() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const sync = () => setActive(motion.matches && !document.hidden);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <div className="ap-hero-hyperspeed" aria-hidden="true">
    {active && <Hyperspeed curve="winding" horizon={0.12} speed={0.325} curvature={0.8} density={36} dust={60} glow={0.55} reflections={0.35} roadOpacity={0} interactive={false} />}
  </div>;
}
