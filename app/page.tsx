import Link from "next/link";
import { prisma } from "./lib/prisma";

const TABS: Record<string, string> = {
  all: "All",
  novel: "Novels",
  manga: "Manga",
  manhwa: "Manhwa",
  comic: "Comics",
};

function initials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string }>;
}) {
  const { type = "all", q = "" } = await searchParams;

  const seriesList = await prisma.series.findMany({
    where: {
      ...(type !== "all" ? { type: type as any } : {}),
      ...(q ? { title: { contains: q } } : {}),
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <>
      <header className="site-header">
        <Link href="/" className="logo display">
          DUZHE
        </Link>
      </header>

      <main>
        <div className="filters">
          {Object.entries(TABS).map(([key, label]) => (
            <Link
              key={key}
              href={key === "all" ? "/" : `/?type=${key}`}
              className={type === key ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
