export const links = {
  name: "Your Name",
  role: "Software Engineer",
  tagline:
    "I build small, durable tools for the web — usually with TypeScript, sometimes with Rust.",
  location: "Bengaluru, IN",
  timezone: "IST (UTC+5:30)",
  status: "Open to interesting work",
  email: "hello@example.com",
  github: "https://github.com/example",
  linkedin: "https://linkedin.com/in/example",
  x: "https://x.com/example",
  website: "https://example.com",
} as const;

export type Links = typeof links;
