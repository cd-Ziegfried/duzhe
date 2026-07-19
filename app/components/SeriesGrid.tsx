import Link from "next/link";
import { initials } from "../lib/format";
import Image from "next/image";

type SeriesCardData = {
  id: number;
  title: string;
  author: string | null;
  type: string;
  cover_color: string | null;
  cover_url: string | null;
};

export default function SeriesGrid({
  seriesList,
}: {
  seriesList: SeriesCardData[];
}) {
  if (seriesList.length === 0) {
    return <p style={{ color: "var(--muted)" }}>No titles here yet.</p>;
  }

  return (
    <div className="grid">
      {seriesList.map((s) => {
        const isProse = s.type === "novel";
        return (
          <Link key={s.id} href={`/series/${s.id}`}>
            <div
              className="cover"
              style={{
                background: s.cover_url
                  ? undefined
                  : `linear-gradient(160deg, ${s.cover_color} 0%, var(--bg) 130%)`,
                ["--accent" as any]: isProse ? "var(--gold)" : "var(--red)",
              }}
            >
              {s.cover_url ? (
                <Image
                  src={s.cover_url}
                  alt={s.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <>
                  <span className="stamp">{initials(s.title)}</span>
                  <p className="cover-title">{s.title}</p>
                </>
              )}
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
  );
}
