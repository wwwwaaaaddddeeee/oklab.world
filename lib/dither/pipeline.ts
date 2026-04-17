import type { DitherSettings } from "@/components/dither/DitherTool";
import type { RasterSource } from "./rasterize";
import { nearestResample } from "./resample";
import {
  errorDiffuse,
  FLOYD_STEINBERG_KERNEL,
  type ErrorDiffusionOptions,
} from "./error-diffusion";

export type DitherResult = {
  width: number;
  height: number;
  bitmap: Uint8Array;
  dotCount: number;
};

export function runPipeline(
  source: RasterSource,
  settings: DitherSettings,
): DitherResult {
  const scaleFrac = Math.max(0.01, Math.min(1, settings.scale / 100));
  const dstW = Math.max(1, Math.round(source.width * scaleFrac));
  const dstH = Math.max(1, Math.round(source.height * scaleFrac));

  const scaled = nearestResample(
    source.luminance,
    source.width,
    source.height,
    dstW,
    dstH,
  );

  const edOpts: ErrorDiffusionOptions = {
    serpentine: settings.serpentine,
    errorStrength: settings.errorStrength / 100,
    threshold: settings.threshold,
    invert: settings.invert,
  };

  // DT-4 (Atkinson) and DT-5 (Bayer) will replace this switch; for now
  // every algorithm routes through Floyd-Steinberg so the UI stays wired.
  const bitmap = errorDiffuse(
    scaled,
    dstW,
    dstH,
    FLOYD_STEINBERG_KERNEL,
    edOpts,
  );

  let dotCount = 0;
  for (let i = 0; i < bitmap.length; i++) if (bitmap[i]) dotCount++;

  return { width: dstW, height: dstH, bitmap, dotCount };
}
