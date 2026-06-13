"use client";

import { cn } from "@/lib/utils";
import { bcms } from "@/bettercms.bindings.generated";

type NavStop = {
  id: string;
  label: string;
};

type OverlayNavProps = {
  stops: readonly NavStop[];
  activeStop: number;
  onNavigate: (n: number) => void;
  name: string;
};

export function OverlayNav({ stops, activeStop, onNavigate, name }: OverlayNavProps) {
  const navItems = stops.filter((_, i) => i !== 0);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 md:py-5">
      <button
        onClick={() => onNavigate(0)}
        className="font-display text-base font-medium tracking-tight text-foreground transition-opacity hover:opacity-70"
        {...bcms.home.identity.name}
      >
        {name}
      </button>
      <nav className="hidden items-center gap-5 md:flex md:gap-7">
        {navItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onNavigate(i + 1)}
            className={cn(
              "font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
              activeStop === i + 1
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}