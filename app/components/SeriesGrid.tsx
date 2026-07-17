import Link from "next/link";
import { initials } from "../lib/format";

type SeriesCardData = {
  id: number;
  title: string;
  author: string | null;
  type: string;
  cover_color: string;
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
                background: `linear-gradient(160deg, ${s.cover_color} 0%, var(--bg) 130%)`,
                ["--accent" as any]: isProse ? "var(--gold)" : "var(--red)",
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
  );
}
