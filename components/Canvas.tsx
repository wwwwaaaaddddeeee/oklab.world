"use client";

import { useEffect, useMemo, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { GooeyFilter } from "./GooeyFilter";
import { Logotype } from "./Logotype";
import { AmbientBlob } from "./AmbientBlob";
import { CursorBlob } from "./CursorBlob";
import { generatePalette } from "@/lib/palette-mvp";

const FILTER_ID = "oklab-goo";
const CURSOR_RADIUS = 90;

export function Canvas() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [reduced, setReduced] = useState(false);
  const palette = useMemo(() => generatePalette(5), []);

  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const sx = useSpring(mx, { stiffness: 80, damping: 15 });
  const sy = useSpring(my, { stiffness: 80, damping: 15 });

  useEffect(() => {
    const onResize = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMq = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onMq);

    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      mq.removeEventListener("change", onMq);
    };
  }, [mx, my]);

  const ambient = useMemo(() => {
    const w = size.w || 1440;
    const h = size.h || 900;
    return palette.colors.map((color, i) => {
      const ratio = (i + 1) / (palette.colors.length + 1);
      return {
        color,
        baseX: w * (0.14 + 0.72 * ratio),
        baseY: h * (0.5 + 0.28 * Math.sin(i * 1.37 + 0.9)),
        radius: 90 + ((i * 41) % 80),
        driftX: 46 + ((i * 19) % 54),
        driftY: 34 + ((i * 23) % 44),
        duration: 17 + ((i * 5) % 14),
        phase: i * 0.6,
      };
    });
  }, [palette, size.w, size.h]);

  if (!size.w) {
    return (
      <main className="fixed inset-0 overflow-hidden bg-background" aria-hidden />
    );
  }

  const wordmarkWidth = Math.max(180, Math.min(size.w * 0.42, 320));

  return (
    <main className="fixed inset-0 overflow-hidden bg-background">
      <span className="sr-only">oklab.world</span>
      <GooeyFilter id={FILTER_ID} strength={12} />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <g style={{ filter: `url(#${FILTER_ID})` }}>
          {ambient.map((blob, i) => (
            <AmbientBlob
              key={i}
              {...blob}
              cursorX={mx}
              cursorY={my}
              reduced={reduced}
            />
          ))}
          <Logotype
            x={size.w / 2}
            y={size.h / 2}
            targetWidth={wordmarkWidth}
          />
          <CursorBlob
            cx={sx}
            cy={sy}
            r={CURSOR_RADIUS}
            color={palette.brightest}
          />
        </g>
      </svg>
    </main>
  );
}
