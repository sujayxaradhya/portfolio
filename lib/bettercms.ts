import { createBetterCMS } from "@betttercms/next";
import type { BetterCMSSchema } from "@/bettercms.generated";

type Schema = BetterCMSSchema & Record<string, unknown>;

export const cms = createBetterCMS<Schema>({
  baseUrl: "https://api.bettercms.ai/api/v1/delivery",
  workspace: "sujay",
  apiKey: process.env.BETTERCMS_API_KEY,
  revalidate: 60,
});