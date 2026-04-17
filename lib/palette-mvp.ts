export type Palette = {
  colors: string[];
  brightest: string;
};

export function generatePalette(count = 5): Palette {
  const baseHue = Math.random() * 360;
  const spacing = 360 / count;
  const colors: string[] = [];
  let brightestIdx = 0;
  let brightestScore = -Infinity;

  for (let i = 0; i < count; i++) {
    const hue = (baseHue + i * spacing + (Math.random() - 0.5) * 24) % 360;
    const lightness = 0.66 + Math.random() * 0.14;
    const chroma = 0.15 + Math.random() * 0.06;
    const score = chroma * (1 - Math.abs(lightness - 0.75));
    if (score > brightestScore) {
      brightestScore = score;
      brightestIdx = i;
    }
    colors.push(
      `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`,
    );
  }

  return { colors, brightest: colors[brightestIdx] };
}
