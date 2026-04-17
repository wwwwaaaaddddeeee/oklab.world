export type ToneOptions = {
  contrast: number; // -100..100
  midtones: number; // 0.1..3.0 (gamma)
  highlights: number; // 0..100 (compression on values > 0.5)
};

export function applyTone(
  input: Uint8ClampedArray,
  { contrast, midtones, highlights }: ToneOptions,
): Uint8ClampedArray {
  if (contrast === 0 && midtones === 1 && highlights === 0) return input;
  const out = new Uint8ClampedArray(input.length);
  const cf = 1 + contrast / 100;
  const invGamma = 1 / midtones;
  const h = highlights / 100;
  for (let i = 0; i < input.length; i++) {
    let v = input[i] / 255;
    v = (v - 0.5) * cf + 0.5;
    if (v < 0) v = 0;
    else if (v > 1) v = 1;
    v = Math.pow(v, invGamma);
    if (h > 0 && v > 0.5) {
      v = 0.5 + (v - 0.5) * (1 - h);
    }
    out[i] = Math.round(v * 255);
  }
  return out;
}
