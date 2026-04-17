"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

const REPEL_RADIUS = 250;
const MAX_OFFSET = 110;

type AmbientBlobProps = {
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
  driftX: number;
  driftY: number;
  duration: number;
  phase: number;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  reduced: boolean;
};

export function AmbientBlob({
  baseX,
  baseY,
  radius,
  color,
  driftX,
  driftY,
  duration,
  phase,
  cursorX,
  cursorY,
  reduced,
}: AmbientBlobProps) {
  const repelX = useTransform([cursorX, cursorY], (input) => {
    const [cx, cy] = input as [number, number];
    const dx = baseX - cx;
    const dy = baseY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist === 0 || dist > REPEL_RADIUS) return 0;
    const falloff = Math.pow(1 - dist / REPEL_RADIUS, 3);
    return (dx / dist) * falloff * MAX_OFFSET;
  });
  const repelY = useTransform([cursorX, cursorY], (input) => {
    const [cx, cy] = input as [number, number];
    const dx = baseX - cx;
    const dy = baseY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist === 0 || dist > REPEL_RADIUS) return 0;
    const falloff = Math.pow(1 - dist / REPEL_RADIUS, 3);
    return (dy / dist) * falloff * MAX_OFFSET;
  });

  return (
    <motion.g style={{ x: repelX, y: repelY }}>
      <motion.g
        animate={
          reduced
            ? undefined
            : {
                x: [-driftX, driftX, -driftX],
                y: [-driftY, driftY, -driftY],
              }
        }
        transition={
          reduced
            ? undefined
            : {
                duration,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: phase,
              }
        }
      >
        <circle cx={baseX} cy={baseY} r={radius} fill={color} />
      </motion.g>
    </motion.g>
  );
}
