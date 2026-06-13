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

export type CertificationData = {
  name: string;
  issuer: string;
  year: string;
  url: string;
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

export type SkillsHeading = {
  title: string;
  subtitle: string;
};

export type StopData = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  project?: ProjectData;
};

/** Flatten a Lexical EditorState (a richtext `value`) to plain text: concatenate
 *  text nodes, ending each block-level node with a newline. */
function lexicalToPlainText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { root?: unknown; type?: string; text?: string; children?: unknown[] };
  if (n.root !== undefined) return lexicalToPlainText(n.root).trim();
  const text = typeof n.text === "string" ? n.text : "";
  const children = Array.isArray(n.children) ? n.children.map(lexicalToPlainText).join("") : "";
  const isBlock = n.type === "paragraph" || n.type === "heading" || n.type === "quote" || n.type === "listitem";
  return text + children + (isBlock ? "\n" : "");
}

/** A richtext field as PLAIN text for compact, unformatted UI (project cards).
 *  Prefers the portable Lexical tree; falls back to stripping tags from the
 *  rendered html. Never returns raw HTML — that would leak as escaped tags. */
function richTextToPlain(rt: RichText | string | null | undefined): string {
  if (!rt) return "";
  if (typeof rt === "string") return rt;
  const fromTree = lexicalToPlainText(rt.value);
  if (fromTree) return fromTree;
  if (rt.html) return rt.html.replace(/<[^>]+>/g, "").trim();
  return "";
}

const HOME_STOPS: { id: string; label: string; lat: number; lng: number }[] = [
  { id: "hero", label: "Top", lat: 20, lng: 0 },
  { id: "about", label: "About", lat: 51.51, lng: -0.13 },
  { id: "experience", label: "Experience", lat: 40.71, lng: -74.01 },
  { id: "skills", label: "Skills", lat: 1.35, lng: 103.82 },
  { id: "contact", label: "Contact", lat: -23.55, lng: -46.63 },
];

const FALLBACK_LINKS: LinksData = {
  name: "Sujay Shukla",
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

const FALLBACK_ABOUT: AboutData = {
  paragraph_1:
    "I'm a software engineer who likes working on small, durable things — the kind of software you can leave for six months and come back to without dread. Most of my work sits somewhere between the front-end and the database.",
  paragraph_2:
    "Lately I've been drawn to single-user tools, static sites, and quiet interfaces. I like the web when it loads quickly, reads clearly, and stays out of the way.",
  paragraph_3:
    "Outside of work, I read too much, walk long distances, and keep a list of projects I'll probably never finish.",
};

export type SiteContent = {
  links: LinksData;
  about: AboutData;
  projects: ProjectData[];
  experience: RoleData[];
  certifications: CertificationData[];
  skills: Record<string, readonly string[]>;
  skillsHeading: SkillsHeading;
  stops: StopData[];
};

/**
 * Fetch + map all site content. Defaults to the server client (build-time, cached).
 * Pass `cmsPublic` + `{ fresh: true }` from the browser to bypass caches and read
 * the latest published content for client-side live refresh (no rebuild needed).
 */
export async function fetchAllContent(
  source: typeof cms = cms,
  opts: { fresh?: boolean } = {},
): Promise<SiteContent> {
  // `revalidate: false` (no tags) makes the SDK issue a `cache: "no-store"` fetch.
  const ro = opts.fresh ? ({ revalidate: false } as const) : undefined;
  const [homeEntry, projectsEntry, experienceEntry, skillsEntry] = await Promise.all([
    source.getEntry<HomeFields>("home", ro).catch(() => null),
    source.getEntry<ProjectsFields>("projects", ro).catch(() => null),
    source.getEntry<ExperienceFields>("experience", ro).catch(() => null),
    source.getEntry<SkillsFields>("skills", ro).catch(() => null),
  ]);

  let links: LinksData = FALLBACK_LINKS;
  let about: AboutData = FALLBACK_ABOUT;

  if (homeEntry) {
    const f = homeEntry.fields;
    const identity = f.identity?.nonRepeatable;
    const aboutZone = f.about?.nonRepeatable;
    const contact = f.contact?.nonRepeatable;

    if (identity) {
      links = {
        name: identity.name ?? FALLBACK_LINKS.name,
        role: identity.role ?? FALLBACK_LINKS.role,
        tagline: identity.tagline ?? FALLBACK_LINKS.tagline,
        location: identity.location ?? FALLBACK_LINKS.location,
        timezone: identity.timezone ?? FALLBACK_LINKS.timezone,
        status: identity.status ?? FALLBACK_LINKS.status,
        email: contact?.email ?? FALLBACK_LINKS.email,
        github: contact?.github ?? FALLBACK_LINKS.github,
        linkedin: contact?.linkedin ?? FALLBACK_LINKS.linkedin,
        x: contact?.x ?? FALLBACK_LINKS.x,
        website: contact?.website ?? FALLBACK_LINKS.website,
      };
    }

    if (aboutZone?.paragraph_1) {
      about = {
        paragraph_1: aboutZone.paragraph_1,
        paragraph_2: aboutZone.paragraph_2 ?? "",
        paragraph_3: aboutZone.paragraph_3 ?? "",
      };
    }
  }

  let projects: ProjectData[] = [];
  if (projectsEntry) {
    const items = projectsEntry.fields.projects?.repeatable ?? [];
    projects = items.map((p) => ({
      title: p.title,
      year: p.year ?? "",
      place: p.place ?? "",
      lat: p.lat ?? 0,
      lng: p.lng ?? 0,
      stack: p.stack ?? [],
      description: richTextToPlain(p.description),
      href: p.href || undefined,
      repo: p.repo || undefined,
    }));
  }

  let experience: RoleData[] = [];
  if (experienceEntry) {
    const roles = experienceEntry.fields.roles?.repeatable ?? [];
    experience = roles.map((r) => ({
      role: r.role,
      company: r.company,
      start: r.start ?? "",
      end: r.end ?? "",
      scope: r.scope ?? "",
    }));
  }

  let certifications: CertificationData[] = [];
  if (experienceEntry) {
    const items = experienceEntry.fields.certifications?.repeatable ?? [];
    certifications = items.map((c) => ({
      name: c.name,
      issuer: c.issuer ?? "",
      year: c.year ?? "",
      url: c.url ?? "",
    }));
  }

  let skills: Record<string, readonly string[]> = {};
  let skillsHeading: SkillsHeading = { title: "Skills", subtitle: "What I work with" };
  if (skillsEntry) {
    const cats = skillsEntry.fields.categories?.repeatable ?? [];
    for (const cat of cats) {
      skills[cat.category_name] = cat.skills ?? [];
    }
    const heading = skillsEntry.fields.heading?.nonRepeatable;
    if (heading) {
      skillsHeading = { title: heading.title, subtitle: heading.subtitle ?? "" };
    }
  }

  const stops = getStops(projects);

  return { links, about, projects, experience, certifications, skills, skillsHeading, stops };
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