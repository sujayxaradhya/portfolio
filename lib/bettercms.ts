import { createBetterCMS } from "@betttercms/next";
import type { BetterCMSSchema } from "@/bettercms.generated";

type Schema = BetterCMSSchema & Record<string, unknown>;

export const cms = createBetterCMS<Schema>({
  baseUrl: "https://api.bettercms.ai/api/v1/delivery",
  workspace: "sujay",
  apiKey: process.env.BETTERCMS_API_KEY,
  revalidate: 60,
});

/** Browser-safe client for live content refresh. Uses a PUBLIC, read-only delivery
 *  key (NEXT_PUBLIC_*, inlined into the client bundle) — safe because it can only
 *  read already-published content. Pair with `fetchAllContent(cmsPublic, { fresh: true })`
 *  to bypass caches and show dashboard edits within seconds, no rebuild. */
export const cmsPublic = createBetterCMS<Schema>({
  baseUrl: "https://api.bettercms.ai/api/v1/delivery",
  workspace: "sujay",
  apiKey: process.env.NEXT_PUBLIC_BETTERCMS_API_KEY,
});