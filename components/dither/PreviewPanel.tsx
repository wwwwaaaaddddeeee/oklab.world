"use client";

import { useEffect, useRef } from "react";
import type { DitherSettings } from "./DitherTool";
import type { RasterSource } from "@/lib/dither/rasterize";
import type { DitherResult } from "@/lib/dither/pipeline";

type Props = {
  settings: DitherSettings;
  source: RasterSource | null;
  result: DitherResult | null;
  loading: boolean;
  error: string | null;
};

const DOT_COLOR = "#ededed";

export function PreviewPanel({ settings, source, result, loading, error }: Props) {
  const mainCanvas = useRef<HTMLCanvasElement | null>(null);
  const thumbCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!result) return;
    paintBitmap(mainCanvas.current, result);
    paintBitmap(thumbCanvas.current, result);
  }, [result]);

  const meta = result
    ? `${settings.algorithm} · scale ${settings.scale}% · ${result.dotCount.toLocaleString()} dots at ${result.width}×${result.height}`
    : source
      ? `${settings.algorithm} · scale ${settings.scale}% · ${source.width}×${source.height}`
      : `${settings.algorithm} · scale ${settings.scale}% · no source`;

  return (
    <div className="flex min-h-dvh flex-col gap-6 p-6 lg:p-10">
      <header className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium">Preview</h2>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {meta}
        </span>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-md border border-border bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.04)_48%,rgba(255,255,255,0.04)_52%,transparent_52%),linear-gradient(-45deg,transparent_48%,rgba(255,255,255,0.04)_48%,rgba(255,255,255,0.04)_52%,transparent_52%)] bg-[size:16px_16px]">
          {source ? (
            <canvas
              ref={mainCanvas}
              className="absolute inset-0 h-full w-full object-contain [image-rendering:pixelated]"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
              {loading ? "rasterizing…" : error ? error : "upload an SVG to preview"}
            </div>
          )}
        </div>
        <div className="relative flex w-full max-w-[160px] items-center justify-center overflow-hidden rounded-md border border-border">
          {result ? (
            <canvas
              ref={thumbCanvas}
              className="block h-auto w-full [image-rendering:pixelated]"
            />
          ) : (
            <span className="py-5 text-[10px] text-muted-foreground">thumbnail</span>
          )}
        </div>
      </div>
    </div>
  );
}

function paintBitmap(canvas: HTMLCanvasElement | null, result: DitherResult) {
  if (!canvas) return;
  canvas.width = result.width;
  canvas.height = result.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const img = ctx.createImageData(result.width, result.height);
  const d = img.data;
  const [r, g, b] = parseHex(DOT_COLOR);
  for (let i = 0, j = 0; i < result.bitmap.length; i++, j += 4) {
    if (result.bitmap[i]) {
      d[j] = r;
      d[j + 1] = g;
      d[j + 2] = b;
      d[j + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function parseHex(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  const v = parseInt(n, 16);
  return [(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
}
