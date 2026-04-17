"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import type { Algorithm, DitherSettings } from "./DitherTool";

const ALGORITHMS: { value: Algorithm; label: string }[] = [
  { value: "floyd-steinberg", label: "Floyd-Steinberg" },
  { value: "atkinson", label: "Atkinson" },
  { value: "bayer-4", label: "Ordered 4×4" },
  { value: "bayer-8", label: "Ordered 8×8" },
];

type Props = {
  settings: DitherSettings;
  update: <K extends keyof DitherSettings>(key: K, value: DitherSettings[K]) => void;
};

export function ControlPanel({ settings, update }: Props) {
  return (
    <div className="flex flex-col gap-5 p-5">
      <header className="flex items-baseline justify-between">
        <h1 className="text-sm font-medium tracking-tight">Dither</h1>
        <span className="text-xs text-muted-foreground">oklab.world/tools</span>
      </header>

      <Section title="Source">
        <DropZone />
      </Section>

      <Separator />

      <Section title="Algorithm">
        <div className="grid grid-cols-2 gap-1">
          {ALGORITHMS.map((a) => {
            const active = settings.algorithm === a.value;
            return (
              <button
                key={a.value}
                type="button"
                onClick={() => update("algorithm", a.value)}
                className={`rounded-md border px-2 py-1.5 text-xs transition-colors ${
                  active
                    ? "border-foreground/40 bg-foreground/10 text-foreground"
                    : "border-border bg-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
        <Toggle
          label="Serpentine scan"
          value={settings.serpentine}
          onChange={(v) => update("serpentine", v)}
        />
      </Section>

      <Separator />

      <Section title="Main settings">
        <SliderRow
          label="Scale"
          suffix="%"
          value={settings.scale}
          min={1}
          max={100}
          step={1}
          onChange={(v) => update("scale", v)}
        />
        <SliderRow
          label="Threshold"
          value={settings.threshold}
          min={0}
          max={255}
          step={1}
          onChange={(v) => update("threshold", v)}
        />
        <Toggle
          label="Invert"
          value={settings.invert}
          onChange={(v) => update("invert", v)}
        />
      </Section>

      <Separator />

      <Section title="Tone curve">
        <SliderRow
          label="Contrast"
          value={settings.contrast}
          min={-100}
          max={100}
          step={1}
          onChange={(v) => update("contrast", v)}
        />
        <SliderRow
          label="Midtones"
          suffix=""
          value={settings.midtones}
          min={0.1}
          max={3}
          step={0.05}
          fmt={(v) => v.toFixed(2)}
          onChange={(v) => update("midtones", v)}
        />
        <SliderRow
          label="Highlights"
          value={settings.highlights}
          min={0}
          max={100}
          step={1}
          onChange={(v) => update("highlights", v)}
        />
      </Section>

      <Separator />

      <Section title="Error strength">
        <SliderRow
          label="Diffusion"
          suffix="%"
          value={settings.errorStrength}
          min={0}
          max={150}
          step={1}
          onChange={(v) => update("errorStrength", v)}
        />
        <SliderRow
          label="Blur"
          suffix="px"
          value={settings.blur}
          min={0}
          max={20}
          step={0.1}
          fmt={(v) => v.toFixed(1)}
          onChange={(v) => update("blur", v)}
        />
      </Section>

      <Separator />

      <Section title="Shape">
        <SliderRow
          label="Corner radius"
          suffix="%"
          value={settings.cornerRadius}
          min={0}
          max={50}
          step={1}
          onChange={(v) => update("cornerRadius", v)}
        />
      </Section>

      <Separator />

      <Section title="Render">
        <SliderRow
          label="Scale"
          suffix="×"
          value={settings.renderScale}
          min={0.1}
          max={1}
          step={0.05}
          fmt={(v) => v.toFixed(2)}
          onChange={(v) => update("renderScale", v)}
        />
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  suffix,
  fmt = (v) => v.toFixed(0),
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  fmt?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="font-mono text-[11px] tabular-nums text-foreground/90">
          {fmt(value)}
          {suffix ?? ""}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
    >
      <span>{label}</span>
      <span
        className={`inline-block h-4 w-7 rounded-full transition-colors ${
          value ? "bg-foreground/70" : "bg-foreground/15"
        }`}
      >
        <span
          className={`mt-0.5 block h-3 w-3 rounded-full bg-background transition-transform ${
            value ? "translate-x-[14px]" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function DropZone() {
  return (
    <label
      htmlFor="dither-upload"
      className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border/80 px-4 py-6 text-center text-xs text-muted-foreground hover:text-foreground"
    >
      <span className="font-medium text-foreground/80">Drop SVG here</span>
      <span>or click to upload</span>
      <input
        id="dither-upload"
        type="file"
        accept=".svg,image/svg+xml"
        className="sr-only"
        disabled
      />
    </label>
  );
}
