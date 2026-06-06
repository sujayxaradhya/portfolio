type Props = {
  index: string;
  title: string;
  eyebrow?: string;
};

export function SectionHeader({ index, title, eyebrow }: Props) {
  return (
    <header className="flex flex-col gap-4 pt-10 section-rule md:pt-14">
      <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span>{index}</span>
        {eyebrow && (
          <>
            <span aria-hidden>·</span>
            <span>{eyebrow}</span>
          </>
        )}
      </div>
      <h2 className="font-display text-3xl leading-[1.05] tracking-tight text-balance md:text-5xl">
        {title}
      </h2>
    </header>
  );
}
