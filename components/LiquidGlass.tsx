import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type LiquidGlassProps = HTMLAttributes<HTMLDivElement> & {
  rimColors?: [string, string];
};

export function LiquidGlass({
  children,
  className,
  rimColors,
  style,
  ...rest
}: LiquidGlassProps) {
  const topHighlight = rimColors?.[0] ?? "var(--glass-highlight)";
  const bottomRim = rimColors?.[1] ?? "var(--glass-rim)";
  const ambientTint = rimColors?.[0];

  const composedStyle: CSSProperties = {
    backgroundImage:
      "linear-gradient(to bottom, var(--glass-bg-top), var(--glass-bg-bottom))",
    boxShadow: [
      "var(--glass-shadow)",
      ambientTint ? `0 6px 24px -6px ${ambientTint}` : null,
      `inset 0 1px 0 0 ${topHighlight}`,
      `inset 0 -1px 0 0 ${bottomRim}`,
    ]
      .filter(Boolean)
      .join(", "),
    backdropFilter: "blur(20px) saturate(140%)",
    WebkitBackdropFilter: "blur(20px) saturate(140%)",
    ...style,
  };

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={composedStyle}
      {...rest}
    >
      {children}
    </div>
  );
}
