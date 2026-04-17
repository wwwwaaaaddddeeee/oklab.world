"use client";

import { motion, type MotionValue } from "framer-motion";

type CursorBlobProps = {
  cx: MotionValue<number>;
  cy: MotionValue<number>;
  r: number;
  color: string;
};

export function CursorBlob({ cx, cy, r, color }: CursorBlobProps) {
  return <motion.circle cx={cx} cy={cy} r={r} fill={color} />;
}
