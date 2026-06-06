export const skills = {
  Languages: ["TypeScript", "Rust", "Go", "Python", "SQL"],
  Frameworks: ["Next.js", "SvelteKit", "Astro", "Hono"],
  "Data & Infra": ["Postgres", "Drizzle", "SQLite", "Cloudflare", "Fly.io"],
  "Tooling & Design": ["Tailwind", "shadcn/ui", "Figma", "Linear", "Bun"],
  "Currently Learning": ["TLA+", "Typography", "WebAssembly"],
} as const;

export type SkillCategory = keyof typeof skills;
