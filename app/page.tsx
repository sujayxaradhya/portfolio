import { fetchAllContent } from "@/lib/content";
import { HomeClient } from "@/components/home-client";

export const revalidate = 60;

export default async function Home() {
  const content = await fetchAllContent();

  return <HomeClient {...content} />;
}