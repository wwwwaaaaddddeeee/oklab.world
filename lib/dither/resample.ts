export function nearestResample(
  src: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
): Uint8ClampedArray {
  if (srcW === dstW && srcH === dstH) return src;
  const dst = new Uint8ClampedArray(dstW * dstH);
  const sx = srcW / dstW;
  const sy = srcH / dstH;
  for (let y = 0; y < dstH; y++) {
    const srcY = Math.min(srcH - 1, Math.floor(y * sy));
    const srcRow = srcY * srcW;
    const dstRow = y * dstW;
    for (let x = 0; x < dstW; x++) {
      const srcX = Math.min(srcW - 1, Math.floor(x * sx));
      dst[dstRow + x] = src[srcRow + srcX];
    }
  }
  return dst;
}
