"use client";

import { useEffect, useRef } from "react";
import { createHexFloat } from "@/lib/HexFloat/HexFloatVanilla";

/** HexFloat acts only on the screenshot; the overlaid copy remains native HTML. */
export function ConsoleHex() {
  const host = useRef<HTMLDivElement>(null);
  const output = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!host.current || !output.current) return;
    const content = host.current;
    const canvas = output.current;
    const query = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const source = document.createElement("canvas");
    const image = new Image();
    let effect: ReturnType<typeof createHexFloat> = null;

    const sync = () => {
      effect?.destroy();
      effect = null;
      if (!query.matches || document.hidden || !image.complete || !image.naturalWidth) return;
      effect = createHexFloat({ source, content, output: canvas, image }, {
        size: 64, gap: 0, bevel: 1, tilt: 0, perspective: 0,
        float: 0, speed: 0.6, shine: 0.5, lift: 0.06, radius: 260,
        flow: 0.6, swirl: 2, trail: 0.25, iridescence: 0.8,
        bloom: 0, grain: 0.08, gapColor: "auto",
      });
    };
    image.onload = sync;
    image.src = "/autoparty-console.jpg";
    document.addEventListener("visibilitychange", sync);
    query.addEventListener("change", sync);
    return () => {
      image.onload = null;
      document.removeEventListener("visibilitychange", sync);
      query.removeEventListener("change", sync);
      effect?.destroy();
    };
  }, []);

  return <div ref={host} className="ap-console-hex" aria-hidden="true"><canvas ref={output} /></div>;
}
