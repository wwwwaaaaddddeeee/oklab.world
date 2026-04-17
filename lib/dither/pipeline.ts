import type { DitherSettings } from "@/components/dither/DitherTool";
import type { RasterSource } from "./rasterize";
import { nearestResample } from "./resample";
import {
  errorDiffuse,
  ATKINSON_KERNEL,
  FLOYD_STEINBERG_KERNEL,
  type ErrorDiffusionOptions,
  type KernelEntry,
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

  let bitmap: Uint8Array;
  switch (settings.algorithm) {
    case "atkinson":
      bitmap = errorDiffuse(scaled, dstW, dstH, ATKINSON_KERNEL, edOpts);
      break;
    case "bayer-4":
    case "bayer-8":
      // DT-5 will replace this with ordered dithering; until then fall back
      // to F-S so the dropdown never produces an empty preview.
      bitmap = errorDiffuse(scaled, dstW, dstH, FLOYD_STEINBERG_KERNEL, edOpts);
      break;
    case "floyd-steinberg":
    default: {
      const kernel: KernelEntry[] = FLOYD_STEINBERG_KERNEL;
      bitmap = errorDiffuse(scaled, dstW, dstH, kernel, edOpts);
      break;
    }
  }

  let dotCount = 0;
  for (let i = 0; i < bitmap.length; i++) if (bitmap[i]) dotCount++;

  return { width: dstW, height: dstH, bitmap, dotCount };
}
