"use client";

import { useState } from "react";
import type { RasterSource } from "@/lib/dither/rasterize";
import type { DitherSettings } from "./DitherTool";
import {
  buildExport,
  copyJsSnippet,
  downloadJson,
} from "@/lib/dither/export";

type Props = {
  source: RasterSource | null;
  settings: DitherSettings;
};

export function ActionBar({ source, settings }: Props) {
  const [copied, setCopied] = useState(false);
  const disabled = !source;

  const handleExport = () => {
    if (!source) return;
    downloadJson(buildExport(source, settings));
  };

  const handleCopy = async () => {
    if (!source) return;
    try {
      await copyJsSnippet(buildExport(source, settings));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleExport}
        disabled={disabled}
        className="rounded-md border border-border bg-foreground/5 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-foreground/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Export JSON
      </button>
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        className="rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        {copied ? "Copied!" : "Copy JS code"}
      </button>
    </div>
  );
}
