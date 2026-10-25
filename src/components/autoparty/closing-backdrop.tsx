"use client";

import { useEffect, useRef } from "react";
import { createBlaze } from "@/lib/Blaze/BlazeVanilla";

/** Canvas UI home's blue sparks, behind native text and links. */
export function ClosingBackdrop() {
  const content = useRef<HTMLDivElement>(null);
  const output = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const source = document.createElement("canvas");
    let effect: ReturnType<typeof createBlaze> = null;
    const sync = () => {
      effect?.destroy();
      effect = null;
      if (!query.matches || document.hidden || !content.current || !output.current) return;
      effect = createBlaze({source, content: content.current, output: output.current, captureContent: false}, {
        sparkColor: [0.45, 0.65, 1], smokeColor: [0.2, 0.45, 1],
        height: 1, distortion: 0.6, distortionScale: 0.5, layers: 4,
        sparkDensity: 1.5, smoke: 0.5, sparks: 0.5, sparkSize: 1, glow: 1.5,
      });
    };
    sync();
    query.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      query.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      effect?.destroy();
    };
  }, []);

  return <div ref={content} className="ap-closing-backdrop" aria-hidden="true"><canvas ref={output} /></div>;
}
