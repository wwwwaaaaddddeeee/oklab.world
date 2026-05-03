import { Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-xs md:max-w-sm space-y-2 leading-snug text-[10px] md:text-[13px]">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Heart
              className="size-2.5 md:size-3 shrink-0"
              fill="#4ade80"
              stroke="#4ade80"
            />
            <span className="text-neutral-400">Liked by</span>
            <span
              aria-hidden
              className="inline-block size-2.5 md:size-3 rounded-full bg-neutral-600 shrink-0"
            />
            <span className="text-white">&amp; 1,104 more</span>
          </div>
          <span className="text-neutral-400 shrink-0">43m ago</span>
        </div>

        <div className="flex gap-5">
          <span className="font-bold text-white">ERL</span>
          <div className="text-neutral-400 space-y-1">
            <p>Look 34 — A/W21</p>
            <p>Available online now</p>
            <p>
              @ <a className="underline">erl.store</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
