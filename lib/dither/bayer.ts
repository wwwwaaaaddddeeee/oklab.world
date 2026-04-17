// Classic normalized Bayer matrices. Values are quantization thresholds
// in 0..N²-1; multiply by 255/N² to get a threshold in 0..255.

export const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

export type BayerOptions = {
  threshold: number; // 0..255 — biases the Bayer threshold so dot density shifts
  invert: boolean;
};

export function bayerDither(
  input: Uint8ClampedArray,
  width: number,
  height: number,
  matrixSize: 4 | 8,
  { threshold, invert }: BayerOptions,
): Uint8Array {
  const matrix = matrixSize === 4 ? BAYER_4 : BAYER_8;
  const n = matrixSize;
  const scale = 255 / (n * n);
  const bias = threshold - 128;
  const out = new Uint8Array(input.length);
  for (let y = 0; y < height; y++) {
    const row = matrix[y % n];
    for (let x = 0; x < width; x++) {
      const bayer = row[x % n] * scale;
      const localThreshold = bayer + bias;
      const dark = input[y * width + x] < localThreshold;
      const bit = dark ? 1 : 0;
      out[y * width + x] = invert ? (bit ? 0 : 1) : bit;
    }
  }
  return out;
}
