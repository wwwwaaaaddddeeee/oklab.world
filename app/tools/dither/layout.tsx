import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dither — oklab.world",
  description: "Dither any SVG into a dot field. Export JSON or JS.",
  robots: { index: false, follow: false },
};

export default function DitherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-dvh bg-background text-foreground">
      {children}
    </div>
  );
}
