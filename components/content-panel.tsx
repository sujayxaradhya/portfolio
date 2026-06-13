"use client";

import { ArrowUpRight, CodeXml, MapPin, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/link-button";
import { CopyEmailButton } from "@/components/copy-email-button";
import { cn } from "@/lib/utils";
import { bcms } from "@/bettercms.bindings.generated";
import type { ProjectData, RoleData, CertificationData, LinksData, StopData, AboutData, SkillsHeading } from "@/lib/content";

type ContentPanelProps = {
  activeStop: number;
  stops: readonly StopData[];
  projects: ProjectData[];
  experience: RoleData[];
  certifications: CertificationData[];
  skills: Record<string, readonly string[]>;
  skillsHeading: SkillsHeading;
  links: LinksData;
  about: AboutData;
  onNavigate: (n: number) => void;
};

function ProjectContent({ project, index }: { project: ProjectData; index: number }) {
  return (
    <div className="flex flex-col gap-4" {...bcms.projects.projects.$(index)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-display text-2xl tracking-tight md:text-3xl" {...bcms.projects.projects.title(index)}>
          {project.title}
        </h3>
        <span className="font-mono text-xs text-muted-foreground" {...bcms.projects.projects.year(index)}>
          {project.year}
        </span>
      </div>
      <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground" {...bcms.projects.projects.place(index)}>
        <MapPin className="text-muted-foreground/70" />
        {project.place}
      </div>
      <p className="text-base leading-relaxed text-pretty text-foreground/80" {...bcms.projects.projects.description(index)}>
        {project.description}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        {project.stack.map((s, j) => (
          <Badge
            key={s}
            variant="secondary"
            className="font-mono text-[10px] font-normal"
            {...bcms.projects.projects.stack.value(index, j)}
          >
            {s}
          </Badge>
        ))}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        {project.href && (
          <LinkButton
            variant="link"
            size="sm"
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            {...bcms.projects.projects.href(index)}
          >
            <ArrowUpRight data-icon="inline-start" />
            Live
          </LinkButton>
        )}
        {project.repo && (
          <LinkButton
            variant="link"
            size="sm"
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            {...bcms.projects.projects.repo(index)}
          >
            <CodeXml data-icon="inline-start" />
            Source
          </LinkButton>
        )}
      </div>
    </div>
  );
}

function AboutContent({ about }: { about: AboutData }) {
  return (
    <div className="flex flex-col gap-5 text-base leading-relaxed text-pretty text-foreground/85 md:text-lg">
      <p {...bcms.home.about.paragraph_1}>{about.paragraph_1}</p>
      <p {...bcms.home.about.paragraph_2}>{about.paragraph_2}</p>
      <p {...bcms.home.about.paragraph_3}>{about.paragraph_3}</p>
    </div>
  );
}

function ExperienceContent({ experience }: { experience: RoleData[] }) {
  return (
    <ol className="relative flex flex-col gap-0 border-l border-rule pl-6 md:pl-8">
      {experience.map((r, i) => (
        <li
          key={`${r.company}-${r.start}`}
          className="relative flex flex-col gap-1 py-5 md:py-6"
          {...bcms.experience.roles.$(i)}
        >
          <span
            aria-hidden
            className="absolute -left-[5px] top-7 size-2.5 rounded-full bg-background ring-1 ring-rule"
          />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-xl tracking-tight md:text-2xl" {...bcms.experience.roles.role(i)}>
              {r.role}
            </h3>
            <span className="font-mono text-xs text-muted-foreground" {...bcms.experience.roles.company(i)}>
              · {r.company}
            </span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span {...bcms.experience.roles.start(i)}>{r.start}</span> – <span {...bcms.experience.roles.end(i)}>{r.end}</span>
          </span>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-pretty text-foreground/85" {...bcms.experience.roles.scope(i)}>
            {r.scope}
          </p>
        </li>
      ))}
    </ol>
  );
}

function CertificationsContent({ certifications }: { certifications: CertificationData[] }) {
  if (certifications.length === 0) return null;
  return (
    <ul className="flex flex-col gap-3">
      {certifications.map((c, i) => (
        <li
          key={`${c.name}-${c.issuer}`}
          className="flex flex-col gap-0.5"
          {...bcms.experience.certifications.$(i)}
        >
          <div className="flex items-center gap-2">
            <Award className="size-4 text-muted-foreground/70 shrink-0" />
            <span className="font-display text-base tracking-tight" {...bcms.experience.certifications.name(i)}>
              {c.name}
            </span>
            {c.issuer && (
              <span className="font-mono text-xs text-muted-foreground" {...bcms.experience.certifications.issuer(i)}>
                · {c.issuer}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground ml-6">
            {c.year && <span {...bcms.experience.certifications.year(i)}>{c.year}</span>}
            {c.url && (
              <LinkButton variant="link" size="sm" href={c.url} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight data-icon="inline-start" />
                Link
              </LinkButton>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function SkillsContent({ skills }: { skills: Record<string, readonly string[]> }) {
  const entries = Object.entries(skills);
  return (
    <dl className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
      {entries.map(([category, items], i) => (
        <div key={category} className="flex flex-col gap-2" {...bcms.skills.categories.$(i)}>
          <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground" {...bcms.skills.categories.category_name(i)}>
            {category}
          </dt>
          <dd className="flex flex-wrap gap-x-1.5 gap-y-1 text-base leading-relaxed text-foreground/90">
            {items.map((s, j) => (
              <span key={s} {...bcms.skills.categories.skills.value(i, j)}>
                {s}
                {j < items.length - 1 && (
                  <span className="text-muted-foreground/40" aria-hidden>,</span>
                )}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ContactContent({ links }: { links: LinksData }) {
  const SOCIALS = [
    { label: "GitHub", href: links.github },
    { label: "LinkedIn", href: links.linkedin },
    { label: "X", href: links.x },
    { label: "Website", href: links.website },
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground" {...bcms.home.contact.email}>
          Email
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${links.email}`}
            className="font-display text-2xl tracking-tight hover:text-accent md:text-4xl text-balance"
            {...bcms.home.contact.email}
          >
            {links.email}
          </a>
          <CopyEmailButton email={links.email} />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Elsewhere
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {SOCIALS.map(({ label, href }) => (
            <LinkButton
              key={label}
              variant="outline"
              size="sm"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowUpRight data-icon="inline-start" />
              {label}
            </LinkButton>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContentPanel({
  activeStop,
  stops,
  projects,
  experience,
  certifications,
  skills,
  skillsHeading,
  links,
  about,
  onNavigate,
}: ContentPanelProps) {
  const stop = stops[activeStop];
  const isVisible = activeStop > 0;

  const getHeader = () => {
    if (!stop) return { index: "", title: "", eyebrow: "" };
    const num = activeStop.toString().padStart(2, "0");
    const projectStop = projects.find((p) => stop.id === p.title.toLowerCase().replace(/\s+/g, "-"));
    if (projectStop) {
      return { index: num, title: projectStop.title, eyebrow: projectStop.place };
    }
    const sectionEyebrows: Record<string, { title: string; eyebrow: string }> = {
      about: { title: "About", eyebrow: "A short note" },
      experience: { title: "Experience", eyebrow: "Where I've worked" },
      skills: { title: skillsHeading.title, eyebrow: skillsHeading.subtitle },
      contact: { title: "Contact", eyebrow: "Get in touch" },
    };
    const section = sectionEyebrows[stop.id];
    if (section) return { index: num, ...section };
    return { index: num, title: stop.label, eyebrow: "" };
  };

  const header = getHeader();

  const headerBinding = stop?.id === "skills"
    ? { ...bcms.skills.heading.title }
    : {};
  const eyebrowBinding = stop?.id === "skills"
    ? { ...bcms.skills.heading.subtitle }
    : {};

  return (
    <div
      className={cn(
        "fixed right-0 top-0 z-40 h-full w-full transition-all duration-500 ease-out md:w-[440px] lg:w-[520px]",
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 pointer-events-none"
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto border-l border-rule/40 bg-background/80 px-6 pt-20 pb-8 backdrop-blur-xl md:px-8">
        <button
          onClick={() => onNavigate(0)}
          className="absolute right-4 top-16 p-2 text-muted-foreground transition-colors hover:text-foreground md:right-6"
          aria-label="Close panel"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>

        <header className="flex flex-col gap-4 pb-2">
          <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span>{header.index}</span>
            {header.eyebrow && (
              <>
                <span aria-hidden>·</span>
                <span {...eyebrowBinding}>{header.eyebrow}</span>
              </>
            )}
          </div>
          <h2 className="font-display text-3xl leading-[1.05] tracking-tight text-balance md:text-4xl" {...headerBinding}>
            {header.title}
          </h2>
        </header>

        <div className="mt-6 flex flex-col gap-6">
          {stop?.project && (
            <ProjectContent project={stop.project} index={projects.findIndex(p => p.title === stop.project!.title)} />
          )}
          {stop?.id === "about" && <AboutContent about={about} />}
          {stop?.id === "experience" && (
            <>
              <ExperienceContent experience={experience} />
              <CertificationsContent certifications={certifications} />
            </>
          )}
          {stop?.id === "skills" && <SkillsContent skills={skills} />}
          {stop?.id === "contact" && <ContactContent links={links} />}
        </div>
      </div>
    </div>
  );
}