export type Role = {
  company: string;
  role: string;
  start: string;
  end: string;
  scope: string;
};

export const experience: Role[] = [
  {
    company: "Independent",
    role: "Software Engineer",
    start: "2024",
    end: "Present",
    scope:
      "Building small, durable tools for the web. Client work on dashboards, internal tools, and the occasional one-page site.",
  },
  {
    company: "A Quiet Studio",
    role: "Senior Engineer",
    start: "2022",
    end: "2024",
    scope:
      "Led the rebuild of an analytics product from a Rails monolith into a typed, edge-deployed TypeScript stack. Cut p95 latency in half.",
  },
  {
    company: "Northwind Labs",
    role: "Full-stack Engineer",
    start: "2020",
    end: "2022",
    scope:
      "Shipped a multi-tenant B2B platform. Owned auth, billing, and the design system. Wrote a lot of tests; deleted even more.",
  },
  {
    company: "Freelance",
    role: "Web Developer",
    start: "2018",
    end: "2020",
    scope:
      "Worked with small businesses and one museum on a handful of long-running projects. Learned the value of saying no.",
  },
];
