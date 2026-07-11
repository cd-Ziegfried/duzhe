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

        <div className="grid">
          {seriesList.length === 0 && (
            <p style={{ color: "var(--muted)" }}>
              No titles match that search.
            </p>
          )}
          {seriesList.map((s) => {
            const isProse = s.type === "novel";
            return (
              <Link key={s.id} href={`/series/${s.id}`}>
                <div
                  className="cover"
                  style={{
                    background: `linear-gradient(160deg, ${s.cover_color} 0%, var(--bg) 130%)`,
                    ["==accent" as any]: isProse ? "var(--gold)" : "var(--red)",
                  }}
                >
                  <span className="stamp">{initials(s.title)}</span>
                  <p className="cover-title">{s.title}</p>
                </div>
                <div className="card-meta">
                  <div className="row">
                    <span
                      className={`badge ${isProse ? "badge-gold" : "badge-red"}`}
                    >
                      {s.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="card-title">{s.title}</p>
                  <p className="card-author">{s.author}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
