"use client";

import { cn } from "@/lib/utils";

type NavStop = {
  id: string;
  label: string;
};

type SectionNavDotsProps = {
  stops: readonly NavStop[];
  activeStop: number;
  onNavigate: (n: number) => void;
};

export function SectionNavDots({
  stops,
  activeStop,
  onNavigate,
}: SectionNavDotsProps) {
  return (
    <nav className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2 md:right-6">
      {stops.map((stop, i) => (
        <button
          key={stop.id}
          onClick={() => onNavigate(i)}
          className="group relative flex items-center justify-end"
          aria-label={`Navigate to ${stop.label}`}
        >
          <span
            className={cn(
              "mr-3 hidden font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-opacity group-hover:opacity-100 md:block",
              activeStop === i ? "opacity-100" : "opacity-0"
            )}
          >
            {stop.label}
          </span>
          <span
            className={cn(
              "block rounded-full transition-all duration-300",
              activeStop === i
                ? "size-2.5 bg-accent"
                : "size-1.5 bg-foreground/30 hover:bg-foreground/60"
            )}
          />
        </button>
      ))}
    </nav>
  );
}