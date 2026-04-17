import Image from "next/image";
import { LiquidGlass } from "@/components/LiquidGlass";
import { GooeyGradient } from "@/components/GooeyGradient";

export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="flex items-center gap-7">
        <LiquidGlass
          className="h-[75px] w-[75px] shrink-0 rounded-full"
          aria-label="oklab.world"
        >
          <GooeyGradient />
        </LiquidGlass>
        <Image
          src="/logomark.svg"
          alt="oklab.world"
          width={3499}
          height={480}
          priority
          className="h-10 w-auto select-none dark:invert"
        />
      </div>
    </main>
  );
}
