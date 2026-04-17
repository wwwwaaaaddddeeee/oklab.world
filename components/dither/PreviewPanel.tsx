"use client";

import { useEffect, useRef } from "react";
import type { DitherSettings } from "./DitherTool";
import type { RasterSource } from "@/lib/dither/rasterize";

type Props = {
  settings: DitherSettings;
  source: RasterSource | null;
  loading: boolean;
  error: string | null;
};

export function PreviewPanel({ settings, source, loading, error }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!source) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(source.width, source.height);
    const d = img.data;
    for (let i = 0, j = 0; i < source.luminance.length; i++, j += 4) {
      const v = source.luminance[i];
      d[j] = v;
      d[j + 1] = v;
      d[j + 2] = v;
      d[j + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, [source]);

  const meta = source
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
              ref={canvasRef}
              className="absolute inset-0 h-full w-full object-contain [image-rendering:pixelated]"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
              {loading ? "rasterizing…" : error ? error : "upload an SVG to preview"}
            </div>
          )}
        </div>
        <div className="flex h-16 w-full max-w-[160px] items-center justify-center rounded-md border border-border text-[10px] text-muted-foreground">
          thumbnail
        </div>
      </div>
    </div>
  );
}
