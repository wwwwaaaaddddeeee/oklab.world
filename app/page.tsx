"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

export default function Home() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex items-center p-8 relative">
      <div className="pointer-events-none fixed inset-y-0 left-1/2 w-px bg-red-500 z-50" />
      <div className="grid grid-cols-2 gap-y-16 md:gap-y-24 leading-snug text-[10px] md:text-[13px] w-full">
        <span aria-hidden />
        <div className="flex flex-col gap-1 max-w-xs md:max-w-sm">
          <span className="text-neutral-500">www.oklab.world</span>
          <span
            className="text-neutral-500 tabular-nums"
            suppressHydrationWarning
          >
            {time ?? ""} CST
          </span>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-block size-2.5 md:size-3 rounded-full bg-neutral-300 shrink-0"
            />
            <span className="text-black">&amp; 1,104 more</span>
          </div>
        </div>

        <span className="font-bold text-black text-right pr-5">OKLB</span>
        <div className="text-neutral-500 space-y-1 max-w-xs md:max-w-sm">
          <p>
            Gradients rendered in a color space designed for how your eyes
            actually see.
          </p>
          <p>Available online now</p>
          <p>
            @{" "}
            <a
              href="https://wa-de.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              wa-de
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
