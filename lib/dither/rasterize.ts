export type RasterSource = {
  width: number;
  height: number;
  luminance: Uint8ClampedArray;
  sourceName: string;
};

function parseSvgDimensions(text: string): { w: number; h: number } | null {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const svg = doc.documentElement;
  if (!svg || svg.nodeName.toLowerCase() !== "svg") return null;

  const vb = svg.getAttribute("viewBox");
  if (vb) {
    const parts = vb.split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      return { w: parts[2], h: parts[3] };
    }
  }

  const wAttr = parseFloat(svg.getAttribute("width") || "");
  const hAttr = parseFloat(svg.getAttribute("height") || "");
  if (Number.isFinite(wAttr) && Number.isFinite(hAttr) && wAttr > 0 && hAttr > 0) {
    return { w: wAttr, h: hAttr };
  }
  return null;
}

export async function rasterizeSvg(
  file: File,
  maxEdge = 1024,
): Promise<RasterSource> {
  const text = await file.text();
  const dims = parseSvgDimensions(text) ?? { w: maxEdge, h: maxEdge };
  const aspect = dims.w / dims.h;

  let renderW = maxEdge;
  let renderH = maxEdge;
  if (aspect > 1) renderH = Math.max(1, Math.round(maxEdge / aspect));
  else renderW = Math.max(1, Math.round(maxEdge * aspect));

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = renderW;
    canvas.height = renderH;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("canvas 2d context unavailable");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, renderW, renderH);
    ctx.drawImage(img, 0, 0, renderW, renderH);

    const { data } = ctx.getImageData(0, 0, renderW, renderH);
    const luminance = new Uint8ClampedArray(renderW * renderH);
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      // BT.709 luma, alpha-blended onto white so transparent → 255
      const a = data[i + 3] / 255;
      const r = data[i] * a + 255 * (1 - a);
      const g = data[i + 1] * a + 255 * (1 - a);
      const b = data[i + 2] * a + 255 * (1 - a);
      luminance[j] = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    }

    return {
      width: renderW,
      height: renderH,
      luminance,
      sourceName: file.name,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
