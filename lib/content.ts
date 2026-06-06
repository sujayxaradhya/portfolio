import { cms } from "@/lib/bettercms";
import type { HomeFields, ProjectsFields, ExperienceFields, SkillsFields, RichText } from "@/bettercms.generated";

export type ProjectData = {
  title: string;
  year: string;
  place: string;
  lat: number;
  lng: number;
  stack: readonly string[];
  description: string;
  href?: string;
  repo?: string;
};

export type RoleData = {
  role: string;
  company: string;
  start: string;
  end: string;
  scope: string;
};

export type SkillCategoryData = {
  category_name: string;
  skills: readonly string[];
};

export type LinksData = {
  name: string;
  role: string;
  tagline: string;
  location: string;
  timezone: string;
  status: string;
  email: string;
  github: string;
  linkedin: string;
  x: string;
  website: string;
};

export type AboutData = {
  paragraph_1: string;
  paragraph_2: string;
  paragraph_3: string;
};

export type StopData = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  project?: ProjectData;
};

function richTextToPlain(rt: RichText | string | null | undefined): string {
  if (!rt) return "";
  if (typeof rt === "string") return rt;
  if (rt.html) return rt.html;
  return "";
}

const HOME_STOPS: { id: string; label: string; lat: number; lng: number }[] = [
  { id: "hero", label: "Top", lat: 20, lng: 0 },
  { id: "about", label: "About", lat: 51.51, lng: -0.13 },
  { id: "experience", label: "Experience", lat: 40.71, lng: -74.01 },
  { id: "skills", label: "Skills", lat: 1.35, lng: 103.82 },
  { id: "contact", label: "Contact", lat: -23.55, lng: -46.63 },
];

export async function getHome(): Promise<LinksData | null> {
  try {
    const entry = await cms.getEntry<HomeFields>("home");
    if (!entry) return null;
    const f = entry.fields;
    return {
      name: f.name,
      role: f.role,
      tagline: f.tagline,
      location: f.location,
      timezone: f.timezone,
      status: f.status,
      email: f.email ?? f.about?.paragraph_1 ?? "",
      github: f.github,
      linkedin: f.linkedin,
      x: f.x,
      website: f.website,
    };
  } catch {
    return null;
  }
}

export async function getAbout(): Promise<AboutData | null> {
  try {
    const entry = await cms.getEntry<HomeFields>("home");
    if (!entry) return null;
    const about = entry.fields.about;
    if (!about) return null;
    return {
      paragraph_1: about.paragraph_1,
      paragraph_2: about.paragraph_2,
      paragraph_3: about.paragraph_3,
    };
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<ProjectData[]> {
  try {
    const res = await cms.listEntries<ProjectsFields>("projects", { perPage: 100 });
    return res.items.map((entry) => {
      const f = entry.fields;
      return {
        title: f.title,
        year: f.year,
        place: f.place,
        lat: f.lat,
        lng: f.lng,
        stack: f.stack,
        description: richTextToPlain(f.description),
        href: f.href || undefined,
        repo: f.repo || undefined,
      };
    });
  } catch {
    return [];
  }
}

export async function getExperience(): Promise<RoleData[]> {
  try {
    const entry = await cms.getEntry<ExperienceFields>("experience");
    if (!entry) return [];
    return entry.fields.roles.map((r) => ({
      role: r.role,
      company: r.company,
      start: r.start,
      end: r.end,
      scope: r.scope,
    }));
  } catch {
    return [];
  }
}

export async function getSkills(): Promise<Record<string, readonly string[]>> {
  try {
    const entry = await cms.getEntry<SkillsFields>("skills");
    if (!entry) return {};
    const result: Record<string, readonly string[]> = {};
    for (const cat of entry.fields.categories) {
      result[cat.category_name] = cat.skills;
    }
    return result;
  } catch {
    return {};
  }
}

export function getStops(projects: ProjectData[]): StopData[] {
  const projectStops: StopData[] = projects.map((p) => ({
    id: p.title.toLowerCase().replace(/\s+/g, "-"),
    label: p.title,
    lat: p.lat,
    lng: p.lng,
    project: p,
  }));

  return [{ ...HOME_STOPS[0] }, ...projectStops, ...HOME_STOPS.slice(1)];
}