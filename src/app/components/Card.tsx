import type { ReactNode } from "react";

interface CardProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <article className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        {title}
      </div>
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">{description}</p>
      {children ? <div className="text-sm text-zinc-600 dark:text-zinc-400">{children}</div> : null}
    </article>
  );
}
