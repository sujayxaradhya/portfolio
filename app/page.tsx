"use client";

import { useRef, useState, useCallback } from "react";
import { DynamicGlobe } from "@/components/3d/dynamic-globe";
import { ScrollController } from "@/components/scroll-controller";
import { OverlayNav } from "@/components/overlay-nav";
import { ContentPanel } from "@/components/content-panel";
import { HeroOverlay } from "@/components/hero-overlay";
import { SectionNavDots } from "@/components/section-nav-dots";
import { stops, type GlobeStop } from "@/data/stops";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { skills } from "@/data/skills";
import { links } from "@/data/links";

export default function Home() {
  const progressRef = useRef(0);
  const [activeStop, setActiveStop] = useState<number>(0);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  const handleStopChange = useCallback((stop: number) => {
    setActiveStop(stop);
    setActiveTitle(stops[stop]?.label ?? null);
  }, []);

  const handleMarkerSelect = useCallback((stop: GlobeStop) => {
    const idx = stops.findIndex((s) => s.id === stop.id);
    if (idx >= 0) {
      setActiveStop(idx);
      setActiveTitle(stop.label);
      progressRef.current = idx;
    }
  }, []);

  const scrollToStop = useCallback((n: number) => {
    const clamped = Math.max(0, Math.min(stops.length - 1, n));
    setActiveStop(clamped);
    setActiveTitle(stops[clamped]?.label ?? null);
    progressRef.current = clamped;
  }, []);

  return (
    <ScrollController
      progressRef={progressRef}
      totalStops={stops.length}
      onStopChange={handleStopChange}
    >
      <div className="fixed inset-0">
        <DynamicGlobe
          stops={stops}
          activeTitle={activeTitle}
          onSelect={handleMarkerSelect}
          progressRef={progressRef}
          activeStop={activeStop}
          totalStops={stops.length}
        />
        <OverlayNav
          stops={stops}
          activeStop={activeStop}
          onNavigate={scrollToStop}
          name={links.name}
        />
        <ContentPanel
          activeStop={activeStop}
          stops={stops}
          projects={projects}
          experience={experience}
          skills={skills}
          links={links}
          onNavigate={scrollToStop}
        />
        <HeroOverlay activeStop={activeStop} />
        <SectionNavDots
          stops={stops}
          activeStop={activeStop}
          onNavigate={scrollToStop}
        />
      </div>
    </ScrollController>
  );
}