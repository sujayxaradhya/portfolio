import { fetchAllContent } from "@/lib/content";
import { HomeClient } from "@/components/home-client";

export const revalidate = 60;

export default async function Home() {
  const { links, about, projects, experience, skills, stops } = await fetchAllContent();

  return (
    <HomeClient
      stops={stops}
      projects={projects}
      experience={experience}
      skills={skills}
      links={links}
      about={about}
    />
  );
}