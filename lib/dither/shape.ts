// Apply a rounded-rect mask to the dither bitmap. `radiusPercent` is 0..50:
// 0 keeps the full rectangle, 50 produces a full circle (corner radius =
// half the shortest edge). Intermediate values interpolate linearly.

export function applyCornerMask(
  bitmap: Uint8Array,
  width: number,
  height: number,
  radiusPercent: number,
): Uint8Array {
  if (radiusPercent <= 0) return bitmap;
  const maxRadius = Math.min(width, height) / 2;
  const r = Math.min(maxRadius, (radiusPercent / 50) * maxRadius);
  if (r <= 0) return bitmap;
  const r2 = r * r;
  const out = new Uint8Array(bitmap.length);
  const right = width - 1;
  const bottom = height - 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let inside = true;
      if (x < r && y < r) {
        const dx = r - x;
        const dy = r - y;
        if (dx * dx + dy * dy > r2) inside = false;
      } else if (x > right - r && y < r) {
        const dx = x - (right - r);
        const dy = r - y;
        if (dx * dx + dy * dy > r2) inside = false;
      } else if (x < r && y > bottom - r) {
        const dx = r - x;
        const dy = y - (bottom - r);
        if (dx * dx + dy * dy > r2) inside = false;
      } else if (x > right - r && y > bottom - r) {
        const dx = x - (right - r);
        const dy = y - (bottom - r);
        if (dx * dx + dy * dy > r2) inside = false;
      }
      if (inside) out[y * width + x] = bitmap[y * width + x];
    }
  }
  return out;
}
