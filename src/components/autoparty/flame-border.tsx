"use client";

import { useEffect, useRef } from "react";
import { createFlameWrap } from "@/lib/FlameWrap/FlameWrapVanilla";

/** Render only fire: links, text and images keep their native DOM geometry. */
export function FlameBorder({ tone = "orange" }: { tone?: "orange" | "cyan" }) {
  const outline = useRef<HTMLDivElement>(null);
  const output = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const source = document.createElement("canvas");
    let effect: ReturnType<typeof createFlameWrap> = null;

    const sync = () => {
      effect?.destroy();
      effect = null;
      if (!query.matches || document.hidden || !outline.current || !output.current) return;

      effect = createFlameWrap(
        { source, content: outline.current, output: output.current, captureContent: false },
        {
          color: tone === "orange" ? [1, 0.4, 0.13] : [0.16, 0.72, 1],
          intensity: 0.48,
          height: 64,
          spread: 8,
          radius: 12,
          speed: 0.18,
          scale: 0.65,
          turbulence: 0.25,
          turbulenceScale: 0.5,
          sparks: 0.3,
          sparkSize: 0.25,
          sparkDensity: 0.45,
          sparkSpeed: 0.4,
          rim: 0.85,
          melt: 0,
          distortion: 0,
          smoke: 0.05,
          ember: 0.6,
          scorch: 0,
        },
      );
    };

    sync();
    query.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      query.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      effect?.destroy();
    };
  }, [tone]);

  return (
    <div className={`ap-fire-border ap-fire-${tone}`} aria-hidden="true">
      <div ref={outline} className="ap-fire-outline" />
      <canvas ref={output} className="ap-fire-output" />
    </div>
  );
}
