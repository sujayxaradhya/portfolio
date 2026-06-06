import { createBetterCMS } from "@betttercms/next";
import type { BetterCMSSchema } from "@/bettercms.generated";

type Schema = BetterCMSSchema & Record<string, unknown>;

export const cms = createBetterCMS<Schema>({
  baseUrl: "https://api.bettercms.ai/api/v1/delivery",
  workspace: "sujay",
  apiKey: process.env.BETTERCMS_API_KEY,
  revalidate: 60,
});

/** Browser client for live content refresh. Published content is public (it's on
 *  the live site), so this reads it KEYLESS — no API key, no repo secrets, nothing
 *  to configure (the workspace slug is already public). The Delivery API returns
 *  published-only without a key; drafts would need one, which we never read here.
 *  Pair with `fetchAllContent(cmsPublic, { fresh: true })` to bypass caches and show
 *  dashboard edits within seconds, no rebuild. */
export const cmsPublic = createBetterCMS<Schema>({
  baseUrl: "https://api.bettercms.ai/api/v1/delivery",
  workspace: "sujay",
});