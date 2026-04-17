import { cn } from "@/lib/utils";

// M0 implementation: 4 absolute-positioned radial blobs animated via CSS
// keyframes with prime-ish, ease-in-out loops (19s/23s/29s/31s) so the
// composite never visibly repeats. Palette is 4 wide-gamut OKLab hues
// blended via mix-blend-mode: screen. SVG fractalNoise overlay adds
// film grain at low opacity.
// Upgrade path: swap to a simplex-noise canvas or WebGL fragment shader
// when we need per-aura palette control in M2/M3.

type GooeyGradientProps = {
  className?: string;
};

export function GooeyGradient({ className }: GooeyGradientProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 bg-[oklch(0.18_0.02_280)]",
        "dark:bg-[oklch(0.12_0.02_280)]",
        className,
      )}
    >
      <div className="gooey-container">
        <div className="gooey-blob gooey-blob--a" />
        <div className="gooey-blob gooey-blob--b" />
        <div className="gooey-blob gooey-blob--c" />
        <div className="gooey-blob gooey-blob--d" />
      </div>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] mix-blend-overlay"
        aria-hidden
      >
        <filter id="gooey-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.6"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#gooey-grain)" />
      </svg>
    </div>
  );
}
