"use client";

import { useRef, useState, useCallback } from "react";
import { DynamicGlobe } from "@/components/3d/dynamic-globe";
import { ScrollController } from "@/components/scroll-controller";
import { OverlayNav } from "@/components/overlay-nav";
import { ContentPanel } from "@/components/content-panel";
import { HeroOverlay } from "@/components/hero-overlay";
import { SectionNavDots } from "@/components/section-nav-dots";
import { useLiveContent } from "@/components/use-live-content";
import type { SiteContent, StopData } from "@/lib/content";

export function HomeClient(initial: SiteContent) {
  const { stops, projects, experience, skills, skillsHeading, links, about } = useLiveContent(initial);
  const progressRef = useRef(0);
  const [activeStop, setActiveStop] = useState<number>(0);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  const handleStopChange = useCallback((stop: number) => {
    setActiveStop(stop);
    setActiveTitle(stops[stop]?.label ?? null);
  }, [stops]);

  const handleMarkerSelect = useCallback((stop: StopData) => {
    const idx = stops.findIndex((s) => s.id === stop.id);
    if (idx >= 0) {
      setActiveStop(idx);
      setActiveTitle(stop.label);
      progressRef.current = idx;
    }
  }, [stops]);

  const scrollToStop = useCallback((n: number) => {
    const clamped = Math.max(0, Math.min(stops.length - 1, n));
    setActiveStop(clamped);
    setActiveTitle(stops[clamped]?.label ?? null);
    progressRef.current = clamped;
  }, [stops]);

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
          skillsHeading={skillsHeading}
          links={links}
          about={about}
          onNavigate={scrollToStop}
        />
        <HeroOverlay activeStop={activeStop} links={links} />
        <SectionNavDots
          stops={stops}
          activeStop={activeStop}
          onNavigate={scrollToStop}
        />
      </div>
    </ScrollController>
  );
}