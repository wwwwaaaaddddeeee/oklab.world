"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { ControlPanel } from "./ControlPanel";
import { PreviewPanel } from "./PreviewPanel";
import { rasterizeSvg, type RasterSource } from "@/lib/dither/rasterize";
import { runPipeline, type DitherResult } from "@/lib/dither/pipeline";

export type Algorithm = "floyd-steinberg" | "atkinson" | "bayer-4" | "bayer-8";

export type DitherSettings = {
  algorithm: Algorithm;
  serpentine: boolean;
  errorStrength: number;
  scale: number;
  blur: number;
  contrast: number;
  midtones: number;
  highlights: number;
  threshold: number;
  invert: boolean;
  cornerRadius: number;
  renderScale: number;
};

export const DEFAULT_SETTINGS: DitherSettings = {
  algorithm: "floyd-steinberg",
  serpentine: true,
  errorStrength: 100,
  scale: 20,
  blur: 0,
  contrast: 0,
  midtones: 1,
  highlights: 0,
  threshold: 128,
  invert: false,
  cornerRadius: 0,
  renderScale: 1,
};

export function DitherTool() {
  const [settings, setSettings] = useState<DitherSettings>(DEFAULT_SETTINGS);
  const [source, setSource] = useState<RasterSource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof DitherSettings>(
    key: K,
    value: DitherSettings[K],
  ) => setSettings((s) => ({ ...s, [key]: value }));

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const raster = await rasterizeSvg(file);
      setSource(raster);
    } catch (e) {
      setError(e instanceof Error ? e.message : "rasterization failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const deferredSettings = useDeferredValue(settings);
  const stale = deferredSettings !== settings;

  const result: DitherResult | null = useMemo(() => {
    if (!source) return null;
    return runPipeline(source, deferredSettings);
  }, [source, deferredSettings]);

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="w-full shrink-0 border-b border-border bg-card/40 lg:h-dvh lg:w-[320px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <ControlPanel
          settings={settings}
          update={update}
          onFile={handleFile}
          source={source}
        />
      </aside>
      <div className="flex-1">
        <PreviewPanel
          settings={settings}
          source={source}
          result={result}
          loading={loading}
          error={error}
          stale={stale}
        />
      </div>
    </div>
  );
}
