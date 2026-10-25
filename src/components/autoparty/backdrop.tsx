"use client";

import { useEffect, useRef } from "react";
import { createHexFloat } from "@/lib/HexFloat/HexFloatVanilla";

/** Canvas UI is decoration; all reading, focus and scrolling stay in the DOM. */
export function WelcomeBackdrop() {
  const source = useRef<HTMLCanvasElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const output = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let effect: ReturnType<typeof createHexFloat> = null;
    const sync = () => {
      effect?.destroy();
      effect = null;
      if (!query.matches || document.hidden || !source.current || !content.current || !output.current) return;
      effect = createHexFloat({source: source.current, content: content.current, output: output.current}, {
        size: 160, gap: 0, bevel: 1.5, tilt: 24, perspective: 0.5,
        float: 0, speed: 1, shine: 0.5, lift: 0.1, radius: 1200,
        flow: 0, swirl: 0, trail: 0, iridescence: 1, bloom: 0, grain: 0.8,
        gapColor: "auto",
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

  return (
    <div className="ap-backdrop" aria-hidden="true">
      <canvas ref={source} className="ap-canvas-source"
        // @ts-expect-error experimental html-in-canvas attribute used by Canvas UI
        layoutsubtree="true"
      ><div ref={content} className="ap-backdrop-content" /></canvas>
      <canvas ref={output} className="ap-canvas-output" />
    </div>
  );
}
