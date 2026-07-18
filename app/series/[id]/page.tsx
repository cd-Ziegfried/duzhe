import Header from "@/app/components/Header";
import { getCurrentUser } from "@/app/lib/auth";
import { initials } from "@/app/lib/format";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
getCurrentUser;

export default async function SeriesDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seriesID = Number(id);

  const series = await prisma.series.findUnique({
    where: { id: seriesID },
    include: {
      series_genres: { include: { genres: true } },
      chapters: { orderBy: { chapter_number: "desc" } },
    },
  });

  const user = await getCurrentUser();
  let isBookmarked = false;

  let resumeChapterId: number | null = null;
  if (user) {
    const progress = await prisma.reading_progress.findUnique({
      where: { user_id_series_id: { user_id: user.id, series_id: series.id } },
    });
  }

  if (user) {
    const bookmark = await prisma.bookmarks.findUnique({
      where: { user_id_series_id: { user_id: user.id, series_id: series.id } },
    });
    isBookmarked = !!bookmark;
  }

  async function toggleBookmark() {
    "use server";
    const current = await getCurrentUser();
    if (!current) redirect("/login");

    const existing = await prisma.bookmarks.findUnique({
      where: {
        user_id_series_id: { user_id: current.id, series_id: series!.id },
      },
    });

    if (existing) {
      await prisma.bookmarks.delete({
        where: {
          user_id_series_id: { user_id: current.id, series_id: series!.id },
        },
      });
    } else {
      await prisma.bookmarks.create({
        data: { user_id: current.id, series_id: series!.id },
      });
    }
    revalidatePath(`/series/${series!.id}`);
  }

  if (!series) {
    notFound();
  }

  const isProse = series.type === "novel";
  const accent = isProse ? "var(--gold)" : "Var(--red)";

  return (
    <>
      <Header active={isProse ? "novels" : "comics"} />
      <main>
        <Link href={isProse ? "/novels" : "/comics"} className="back-link">
          &larr; {isProse ? "novels" : "comics"}
        </Link>

        <div className="detail-head">
          <div className="detail-cover">
            <div
              className="cover"
              style={{
                height: 260,
                background: `linear-gradient(160deg, ${series.cover_color} 0%, var(--bg) 130%)`,
                ["--accent" as any]: accent,
              }}
            >
              <span className="stamp">{initials(series.title)}</span>
              <p className="cover-title">{series.title}</p>
            </div>
          </div>

          <div className="detail-info">
            <span className={`badge ${isProse ? "badge-gold" : "badge-red"}`}>
              {series.type.toUpperCase()}
            </span>

            <h1
              className="display"
              style={{ fontSize: 34, margin: "10px 0 4px" }}
            >
              {series.title}
            </h1>

            <p className="sub">
              {series.author} &middot; {series.status} &middot;
              {series.chapters.length} chapters
            </p>

            <div className="genre-tags">
              {series.series_genres.map((sg) => (
                <span key={sg.genre_id} className="genre-tag">
                  {sg.genres.name}
                </span>
              ))}
            </div>

            <p className="synopsis">{series.synopsis}</p>

            {series.chapters.length > 0 && (
              <Link
                href={`/read/${resumeChapterId ?? series.chapters[series.chapters.length - 1].id}`}
                className="btn btn-primary"
                style={{
                  ["--accent" as any]: accent,
                  display: "inline-flex",
                }}
              >
                {resumeChapterId ? "Continue reading" : "Start reading"}
              </Link>
            )}

            {user ? (
              <form action={toggleBookmark}>
                <button className="btn btn-ghost" type="submit">
                  {isBookmarked ? "★ Saved" : "☆ Save"}
                </button>
              </form>
            ) : (
              <a className="btn btn-ghost" href="/login">
                Save
              </a>
            )}
          </div>
        </div>

        <h3 className="section-label">Chapters</h3>
        <div className="chapter-list">
          {series.chapters.length === 0 && (
            <div className="chapter-row">
              <span style={{ color: "var(--muted)" }}>No chapter yet.</span>
            </div>
          )}
          {series.chapters.map((c) => (
            <Link key={c.id} href={`/read/${c.id}`} className="chapter-row">
              <span style={{ color: "var(--text)" }}>
                Chapter {Number(c.chapter_number)}
                {c.title && (
                  <span
                    style={{ color: accent, fontSize: 11.5, marginLeft: 8 }}
                  >
                    &#9679; {c.title}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
