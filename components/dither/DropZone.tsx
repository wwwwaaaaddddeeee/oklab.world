"use client";

import { useRef, useState } from "react";

type Props = {
  onFile: (file: File) => void;
  currentName?: string;
};

export function DropZone({ onFile, currentName }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = (file: File | null | undefined) => {
    if (!file) return;
    if (!/\.svg$/i.test(file.name) && file.type !== "image/svg+xml") {
      setError("SVG only");
      return;
    }
    setError(null);
    onFile(file);
  };

  return (
    <label
      htmlFor="dither-upload"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        accept(e.dataTransfer.files?.[0]);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed px-4 py-6 text-center text-xs transition-colors ${
        dragging
          ? "border-foreground/60 bg-foreground/5 text-foreground"
          : "border-border/80 text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className="font-medium text-foreground/80">
        {currentName ? "Replace SVG" : "Drop SVG here"}
      </span>
      <span>{currentName ?? "or click to upload"}</span>
      {error ? <span className="text-red-400">{error}</span> : null}
      <input
        ref={inputRef}
        id="dither-upload"
        type="file"
        accept=".svg,image/svg+xml"
        className="sr-only"
        onChange={(e) => accept(e.target.files?.[0])}
      />
    </label>
  );
}
