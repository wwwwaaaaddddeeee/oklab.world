// Generic error-diffusion dither. Kernel entries list neighbors for the
// current scan direction (left-to-right); on a right-to-left serpentine
// row we mirror dx when distributing error.
//
// Output semantics: bit = 1 means "dot placed" (source was darker than
// threshold). Rendering code can walk the bitmap and draw on 1s.

export type KernelEntry = { dx: number; dy: number; w: number };

export const FLOYD_STEINBERG_KERNEL: KernelEntry[] = [
  { dx: 1, dy: 0, w: 7 / 16 },
  { dx: -1, dy: 1, w: 3 / 16 },
  { dx: 0, dy: 1, w: 5 / 16 },
  { dx: 1, dy: 1, w: 1 / 16 },
];

export const ATKINSON_KERNEL: KernelEntry[] = [
  { dx: 1, dy: 0, w: 1 / 8 },
  { dx: 2, dy: 0, w: 1 / 8 },
  { dx: -1, dy: 1, w: 1 / 8 },
  { dx: 0, dy: 1, w: 1 / 8 },
  { dx: 1, dy: 1, w: 1 / 8 },
  { dx: 0, dy: 2, w: 1 / 8 },
];

export type ErrorDiffusionOptions = {
  serpentine: boolean;
  errorStrength: number; // 0..1.5, multiplier applied to the diffused error
  threshold: number; // 0..255
  invert: boolean;
};

export function errorDiffuse(
  input: Uint8ClampedArray,
  width: number,
  height: number,
  kernel: KernelEntry[],
  options: ErrorDiffusionOptions,
): Uint8Array {
  const buf = new Float32Array(input.length);
  for (let i = 0; i < input.length; i++) buf[i] = input[i];

  const out = new Uint8Array(input.length);
  const { serpentine, errorStrength, threshold, invert } = options;

  for (let y = 0; y < height; y++) {
    const leftToRight = !serpentine || (y & 1) === 0;
    const step = leftToRight ? 1 : -1;
    const startX = leftToRight ? 0 : width - 1;
    const endX = leftToRight ? width : -1;

    for (let x = startX; x !== endX; x += step) {
      const idx = y * width + x;
      const old = buf[idx];
      const dark = old < threshold;
      // dot placed where source is dark (so a dark logo → dots form the logo)
      const bit = dark ? 1 : 0;
      const quantized = dark ? 0 : 255;
      out[idx] = invert ? (bit ? 0 : 1) : bit;

      const err = (old - quantized) * errorStrength;
      if (err === 0) continue;

      for (const k of kernel) {
        const ndx = leftToRight ? k.dx : -k.dx;
        const nx = x + ndx;
        const ny = y + k.dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        buf[ny * width + nx] += err * k.w;
      }
    }
  }

  return out;
}
