import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ReadChapter({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;

  const chapter = await prisma.chapters.findUnique({
    where: { id: Number(chapterId) },
    include: {
      series: true,
      chapter_text: true,
      chapter_pages: { orderBy: { page_number: "asc" } },
    },
  });

  if (!chapter) {
    notFound();
  }

  const isProse = chapter.series.type === "novel";
  const accent = isProse ? "var(--gold)" : "var(--red)";
  const chapterNum = Number(chapter.chapter_number);

  return (
    <main>
      <div className="reader-wrap">
        <div className="reader-toolbar">
          <Link href={`/series/${chapter.series_id}`} className="back-link">
            &larr; {chapter.series.title}
          </Link>
        </div>

        <p className="chapter-eyebrow" style={{ color: accent }}>
          CHAPTER {chapterNum}
        </p>
        {chapter.title && <h2 className="chapter-heading">{chapter.title}</h2>}

        {isProse ? (
          <div
            className="novel-body"
            dangerouslySetInnerHTML={{
              __html:
                chapter.chapter_text?.body ??
                "<p>This chapter has no text yet.</p>",
            }}
          />
        ) : (
          <div className="page-scroll">
            {chapter.chapter_pages.length === 0 && (
              <p style={{ color: "var(--muted)" }}>
                This chapter has no pages uploaded yet.
              </p>
            )}
            {chapter.chapter_pages.map((p) => (
              <div key={p.id} className="page-slot">
                {p.image_url ? (
                  <img src={p.image_url} alt={`Page ${p.page_number}`} />
                ) : (
                  <span className="label">Page {p.page_number}</span>
                )}
                <span className="num">
                  {p.page_number} / {chapter.chapter_pages.length}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
