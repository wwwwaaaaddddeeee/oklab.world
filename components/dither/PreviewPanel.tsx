"use client";

import type { DitherSettings } from "./DitherTool";

type Props = {
  settings: DitherSettings;
};

export function PreviewPanel({ settings }: Props) {
  return (
    <div className="flex min-h-dvh flex-col gap-6 p-6 lg:p-10">
      <header className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium">Preview</h2>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {settings.algorithm} · scale {settings.scale}% · 0 dots
        </span>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-md border border-border bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.04)_48%,rgba(255,255,255,0.04)_52%,transparent_52%),linear-gradient(-45deg,transparent_48%,rgba(255,255,255,0.04)_48%,rgba(255,255,255,0.04)_52%,transparent_52%)] bg-[size:16px_16px]">
          <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
            upload an SVG to preview
          </div>
        </div>
        <div className="flex h-16 w-full max-w-[160px] items-center justify-center rounded-md border border-border text-[10px] text-muted-foreground">
          thumbnail
        </div>
      </div>
    </div>
  );
}
