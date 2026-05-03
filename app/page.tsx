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
  const [time, setTime] = useState(() => formatter.format(new Date()));

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-8">
      <div className="flex flex-col gap-12 md:gap-24 leading-snug text-[10px] md:text-[13px] max-w-[14rem] md:max-w-[16rem]">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-black mb-6 text-[16px] md:text-[20px]">
            OKLB
          </span>
          <span className="text-neutral-500">www.oklab.world</span>
          <span
            className="text-neutral-500 tabular-nums"
            suppressHydrationWarning
          >
            {time} CST
          </span>
        </div>

        <div className="flex items-center gap-1">
          {["gl-01", "gl-02", "gl-03", "gl-04", "gl-05"].map((name) => (
            <img
              key={name}
              src={`/${name}.png`}
              alt=""
              className="size-4 shrink-0"
            />
          ))}
        </div>

        <div className="text-neutral-500 space-y-3">
          <p>
            Gradients rendered in a color space designed for how your eyes
            actually see.
          </p>
          <p>Public soon.</p>
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
