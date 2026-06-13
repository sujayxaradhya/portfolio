"use client";

import { cn } from "@/lib/utils";
import { bcms } from "@/bettercms.bindings.generated";
import type { LinksData } from "@/lib/content";

type HeroOverlayProps = {
  activeStop: number;
  links: LinksData;
};

export function HeroOverlay({ activeStop, links }: HeroOverlayProps) {
  const isHero = activeStop === 0;

  return (
    <div
      className={cn(
        "fixed inset-0 z-30 flex items-center justify-center transition-all duration-700",
        isHero
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Portfolio · {new Date().getFullYear()}
        </p>
        <h1 className="font-display text-[clamp(3.25rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.02em] text-balance" {...bcms.home.identity.name}>
          {links.name}
        </h1>
        <p className="max-w-2xl font-display text-xl leading-snug text-pretty text-muted-foreground italic md:text-2xl">
          <span {...bcms.home.identity.role}>{links.role}</span> — <span {...bcms.home.identity.tagline}>{links.tagline}</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
          <span {...bcms.home.identity.location}>{links.location}</span>
          <span aria-hidden>·</span>
          <span {...bcms.home.identity.timezone}>{links.timezone}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-2" {...bcms.home.identity.status}>
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            {links.status}
          </span>
        </div>
        <div className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground animate-bounce">
          <span className="h-px w-10 bg-rule" aria-hidden />
          <span>Scroll</span>
        </div>
      </div>
    </div>
  );
}