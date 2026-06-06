"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";
import type { GlobeStop } from "@/data/stops";

const Globe = dynamic(() => import("./globe").then((m) => m.Globe), {
  ssr: false,
  loading: () => <GlobeFallback />,
});

function GlobeFallback() {
  return (
    <div
      aria-hidden
      className="flex h-full w-full items-center justify-center text-muted-foreground/50"
    >
      <svg
        viewBox="0 0 100 100"
        className="size-2/3 max-w-[320px]"
        style={{ animation: "spin 24s linear infinite" }}
      >
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeDasharray="1.5 2.5"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="42"
          ry="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="18"
          ry="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
        />
        <line
          x1="8"
          y1="50"
          x2="92"
          y2="50"
          stroke="currentColor"
          strokeWidth="0.3"
        />
        <line
          x1="50"
          y1="8"
          x2="50"
          y2="92"
          stroke="currentColor"
          strokeWidth="0.3"
        />
      </svg>
    </div>
  );
}

type Props = {
  stops: GlobeStop[];
  activeTitle: string | null;
  onSelect: (stop: GlobeStop) => void;
  progressRef: RefObject<number>;
  activeStop: number;
  totalStops: number;
};

export function DynamicGlobe(props: Props) {
  return <Globe {...props} />;
}