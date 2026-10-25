"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  createHexFloat,
  supportsHtmlInCanvas,
  type HexFloatInstance,
  type HexFloatOptions,
} from "./HexFloatVanilla";

export interface HexFloatProps extends HexFloatOptions {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const emptySubscribe = () => () => {};

export function HexFloat({
  children,
  className,
  style,
  ...options
}: HexFloatProps) {
  const sourceRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<HexFloatInstance | null>(null);
  const [initialOptions] = useState(options);
  const [failed, setFailed] = useState(false);

  const supported = useSyncExternalStore(
    emptySubscribe,
    supportsHtmlInCanvas,
    () => false,
  );
  const native = supported && !failed;

  useEffect(() => {
    const source = sourceRef.current;
    const content = contentRef.current;
    const output = outputRef.current;
    if (!source || !content || !output) return;
    instanceRef.current = createHexFloat(
      { source, content, output },
      initialOptions,
    );
    if (native && !instanceRef.current) setFailed(true);
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [initialOptions, native]);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbState, setThumbState] = useState<{
    top: number;
    height: number;
    visible: boolean;
    active: boolean;
  }>({ top: 0, height: 48, visible: false, active: false });

  // Update effect options live
  useEffect(() => {
    instanceRef.current?.setOptions(options);
  });

  // Comprehensive scroll support (wheel, touch, keyboard & draggable scrollbar)
  useEffect(() => {
    const content = contentRef.current;
    const container = containerRef.current;
    if (!content || !container) return;

    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let isDraggingThumb = false;
    let dragStartY = 0;
    let dragStartScrollTop = 0;

    const updateScrollbar = (show = true) => {
      const maxScroll = content.scrollHeight - content.clientHeight;
      if (maxScroll <= 1) {
        setThumbState((s) => ({ ...s, visible: false }));
        return;
      }
      const trackHeight = window.innerHeight;
      const height = Math.max(
        36,
        Math.round((content.clientHeight / content.scrollHeight) * trackHeight),
      );
      const top = Math.round(
        (content.scrollTop / maxScroll) * (trackHeight - height),
      );

      if (show) {
        if (hideTimer) clearTimeout(hideTimer);
        setThumbState({
          top,
          height,
          visible: true,
          active: isDraggingThumb,
        });
        if (!isDraggingThumb) {
          hideTimer = setTimeout(() => {
            setThumbState((s) => ({ ...s, visible: false }));
          }, 1200);
        }
      } else {
        setThumbState((s) => ({ ...s, top, height }));
      }
    };

    // Wheel event handler
    const onWheel = (e: WheelEvent) => {
      // Check if event target is an inner scrollable container (e.g. nested textarea or code block)
      let target = e.target as HTMLElement | null;
      let handledByChild = false;
      while (target && target !== content && target !== document.body) {
        if (target.scrollHeight > target.clientHeight) {
          const style = window.getComputedStyle(target);
          if (style.overflowY === "auto" || style.overflowY === "scroll") {
            const atTop = target.scrollTop <= 0 && e.deltaY < 0;
            const atBottom =
              target.scrollTop + target.clientHeight >= target.scrollHeight - 1 &&
              e.deltaY > 0;
            if (!atTop && !atBottom) {
              handledByChild = true;
              break;
            }
          }
        }
        target = target.parentElement;
      }

      if (handledByChild) return;

      let dy = e.deltaY;
      let dx = e.deltaX;
      if (e.deltaMode === 1) {
        dy *= 33;
        dx *= 33;
      } else if (e.deltaMode === 2) {
        dy *= window.innerHeight;
        dx *= window.innerWidth;
      }

      content.scrollTop += dy;
      content.scrollLeft += dx;
      updateScrollbar(true);
    };

    // Touch event handler for mobile/touch screens
    let touchStartY = 0;
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const dy = touchStartY - currentY;
      const dx = touchStartX - currentX;
      touchStartY = currentY;
      touchStartX = currentX;

      content.scrollTop += dy;
      content.scrollLeft += dx;
      updateScrollbar(true);
    };

    // Keyboard navigation handler (Arrows, PageUp/Down, Space, Home, End)
    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.tagName === "SELECT" ||
          (active as HTMLElement).isContentEditable)
      ) {
        return;
      }

      let delta = 0;
      if (e.key === "ArrowDown") delta = 60;
      else if (e.key === "ArrowUp") delta = -60;
      else if (e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        delta = window.innerHeight * 0.75;
      } else if (e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        delta = -window.innerHeight * 0.75;
      } else if (e.key === "Home") {
        content.scrollTo({ top: 0, behavior: "smooth" });
        return;
      } else if (e.key === "End") {
        content.scrollTo({ top: content.scrollHeight, behavior: "smooth" });
        return;
      }

      if (delta !== 0) {
        e.preventDefault();
        content.scrollBy({ top: delta, behavior: "smooth" });
        updateScrollbar(true);
      }
    };

    // Thumb dragging handler
    const onThumbPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingThumb = true;
      dragStartY = e.clientY;
      dragStartScrollTop = content.scrollTop;
      setThumbState((s) => ({ ...s, active: true, visible: true }));
      if (hideTimer) clearTimeout(hideTimer);

      const onPointerMove = (ev: PointerEvent) => {
        if (!isDraggingThumb) return;
        const maxScroll = content.scrollHeight - content.clientHeight;
        const trackHeight = window.innerHeight;
        const height = thumbState.height || 48;
        const trackUsable = trackHeight - height;
        if (trackUsable <= 0) return;

        const deltaY = ev.clientY - dragStartY;
        const scrollDelta = (deltaY / trackUsable) * maxScroll;
        content.scrollTop = dragStartScrollTop + scrollDelta;
        updateScrollbar(true);
      };

      const onPointerUp = () => {
        isDraggingThumb = false;
        setThumbState((s) => ({ ...s, active: false }));
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        hideTimer = setTimeout(() => {
          setThumbState((s) => ({ ...s, visible: false }));
        }, 1200);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    };

    // Track click jump handler
    const onTrackClick = (e: MouseEvent) => {
      const maxScroll = content.scrollHeight - content.clientHeight;
      if (maxScroll <= 0) return;
      const trackHeight = window.innerHeight;
      const height = thumbState.height || 48;
      const clickY = e.clientY;
      const targetTop = clickY - height / 2;
      const ratio = Math.max(0, Math.min(1, targetTop / (trackHeight - height)));
      content.scrollTo({ top: ratio * maxScroll, behavior: "smooth" });
    };

    // Attach listeners
    container.addEventListener("wheel", onWheel, { passive: true });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    content.addEventListener("scroll", () => updateScrollbar(true), { passive: true });
    window.addEventListener("resize", () => updateScrollbar(false));

    const track = trackRef.current;
    if (track) {
      track.addEventListener("click", onTrackClick);
    }

    const thumb = thumbRef.current;
    if (thumb) {
      thumb.addEventListener("pointerdown", onThumbPointerDown);
    }

    const observer = new ResizeObserver(() => updateScrollbar(false));
    observer.observe(content);

    // Initial check
    updateScrollbar(false);

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", () => updateScrollbar(false));
      observer.disconnect();
      if (track) {
        track.removeEventListener("click", onTrackClick);
      }
      if (thumb) {
        thumb.removeEventListener("pointerdown", onThumbPointerDown);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", ...style }}
    >
      <canvas
        ref={sourceRef}
        // @ts-expect-error experimental html-in-canvas attribute
        layoutsubtree="true"
        suppressHydrationWarning
        style={
          native
            ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
            : { display: "none" }
        }
      >
        {native ? (
          <div
            ref={contentRef}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {children}
          </div>
        ) : null}
      </canvas>
      {!native ? (
        <div
          ref={contentRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </div>
      ) : null}
      <canvas
        ref={outputRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Interactive overlay scrollbar */}
      <div
        ref={trackRef}
        aria-hidden="true"
        className="fixed top-0 right-0 bottom-0 z-50 w-3 cursor-pointer select-none"
        style={{ touchAction: "none" }}
      >
        <div
          ref={thumbRef}
          className="absolute right-0.5 w-2 rounded-full transition-opacity duration-300"
          style={{
            height: `${thumbState.height}px`,
            transform: `translateY(${thumbState.top}px)`,
            backgroundColor: thumbState.active
              ? "rgba(255, 255, 255, 0.75)"
              : "rgba(255, 255, 255, 0.35)",
            opacity: thumbState.visible || thumbState.active ? 1 : 0,
            cursor: "grab",
          }}
        />
      </div>
    </div>
  );
}

export type { HexFloatInstance, HexFloatOptions };

export default HexFloat;
