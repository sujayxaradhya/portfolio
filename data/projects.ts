// Replace with your real content. Keep types strict so the UI stays consistent.

export type Project = {
  title: string;
  year: string;
  place: string;
  lat: number;
  lng: number;
  stack: string[];
  description: string;
  href?: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    title: "Atlas",
    year: "2025",
    place: "Bengaluru, IN",
    lat: 12.97,
    lng: 77.59,
    stack: ["Next.js", "TypeScript", "Postgres", "Drizzle"],
    description:
      "A small, fast dashboard for monitoring home energy use. Polls an MQTT broker, stores readings, renders one quiet chart.",
    href: "https://example.com/atlas",
    repo: "https://github.com/example/atlas",
  },
  {
    title: "Marginalia",
    year: "2024",
    place: "San Francisco, US",
    lat: 37.77,
    lng: -122.42,
    stack: ["SvelteKit", "SQLite", "Cloudflare"],
    description:
      "A single-user read-later app. Inboxes an article, strips it to text, and serves it back the next morning as a quiet digest.",
    href: "https://example.com/marginalia",
  },
  {
    title: "Field Notes",
    year: "2024",
    place: "Berlin, DE",
    lat: 52.52,
    lng: 13.41,
    stack: ["Astro", "MDX", "Tailwind"],
    description:
      "A personal notebook for short essays. Static, dark by default, and small enough to read on a phone in a coffee shop.",
    repo: "https://github.com/example/field-notes",
  },
  {
    title: "Index",
    year: "2023",
    place: "Tokyo, JP",
    lat: 35.68,
    lng: 139.69,
    stack: ["Go", "htmx", "Postgres"],
    description:
      "An offline-first bookmark manager. Tag, search, archive. Designed to be opened, used, and closed in under a second.",
  },
];
