import { getHome, getAbout, getProjects, getExperience, getSkills, getStops } from "@/lib/content";
import { HomeClient } from "@/components/home-client";

export default async function Home() {
  const [home, about, projects, experience, skills] = await Promise.all([
    getHome(),
    getAbout(),
    getProjects(),
    getExperience(),
    getSkills(),
  ]);

  const links = home ?? {
    name: "Your Name",
    role: "Software Engineer",
    tagline: "I build small, durable tools for the web.",
    location: "Bengaluru, IN",
    timezone: "IST (UTC+5:30)",
    status: "Open to interesting work",
    email: "hello@example.com",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
    x: "https://x.com/example",
    website: "https://example.com",
  };

  const aboutData = about ?? {
    paragraph_1:
      "I'm a software engineer who likes working on small, durable things — the kind of software you can leave for six months and come back to without dread. Most of my work sits somewhere between the front-end and the database.",
    paragraph_2:
      "Lately I've been drawn to single-user tools, static sites, and quiet interfaces. I like the web when it loads quickly, reads clearly, and stays out of the way.",
    paragraph_3:
      "Outside of work, I read too much, walk long distances, and keep a list of projects I'll probably never finish.",
  };

  const stops = getStops(projects);

  return (
    <HomeClient
      stops={stops}
      projects={projects}
      experience={experience}
      skills={skills}
      links={links}
      about={aboutData}
    />
  );
}