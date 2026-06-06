"use client";

import { useEffect, useState } from "react";
import { cmsPublic } from "@/lib/bettercms";
import { fetchAllContent, type SiteContent } from "@/lib/content";

/**
 * Live content for a statically-built page.
 *
 * Renders the build-time content instantly (good first paint + SEO), then fetches
 * the latest published content from the Delivery API on mount and swaps it in — so
 * dashboard/MCP edits show up within seconds, with no rebuild. On any failure the
 * built content stays (the page never regresses or flashes empty).
 */
export function useLiveContent(initial: SiteContent): SiteContent {
  const [content, setContent] = useState<SiteContent>(initial);

  useEffect(() => {
    let cancelled = false;
    fetchAllContent(cmsPublic, { fresh: true })
      .then((live) => {
        if (!cancelled) setContent(live);
      })
      .catch(() => {
        /* keep the built content */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}
