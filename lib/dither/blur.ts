export function gaussianBlur(
  input: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number,
): Uint8ClampedArray {
  if (radius <= 0) return input;
  const sigma = Math.max(0.5, radius / 2);
  const kSize = Math.max(1, Math.ceil(radius)) * 2 + 1;
  const half = (kSize - 1) / 2;
  const kernel = new Float32Array(kSize);
  let sum = 0;
  const twoSigmaSq = 2 * sigma * sigma;
  for (let i = 0; i < kSize; i++) {
    const x = i - half;
    kernel[i] = Math.exp(-(x * x) / twoSigmaSq);
    sum += kernel[i];
  }
  for (let i = 0; i < kSize; i++) kernel[i] /= sum;

  const temp = new Float32Array(input.length);
  for (let y = 0; y < height; y++) {
    const rowStart = y * width;
    for (let x = 0; x < width; x++) {
      let acc = 0;
      for (let k = 0; k < kSize; k++) {
        let sx = x + k - half;
        if (sx < 0) sx = 0;
        else if (sx >= width) sx = width - 1;
        acc += input[rowStart + sx] * kernel[k];
      }
      temp[rowStart + x] = acc;
    }
  }

  const out = new Uint8ClampedArray(input.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let acc = 0;
      for (let k = 0; k < kSize; k++) {
        let sy = y + k - half;
        if (sy < 0) sy = 0;
        else if (sy >= height) sy = height - 1;
        acc += temp[sy * width + x] * kernel[k];
      }
      out[y * width + x] = Math.round(acc);
    }
  }
  return out;
}
