import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function deleteChapter(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  await prisma.chapters.delete({ where: { id } });
  revalidatePath("/admin/chapters");
}

export default async function AdminChapterList() {
  const chapters = await prisma.chapters.findMany({
    include: { series: true },
    orderBy: { published_at: "desc" },
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1 className="page-title display">Chapters</h1>
          <p className="page-sub">
            Every chapter published across the library.
          </p>
        </div>
        <Link
          className="btn btn-primary"
          style={{ ["--accent" as any]: "var(--gold)" }}
          href="/admin/chapters/new"
        >
          + New chapter
        </Link>
      </div>

      <table className="admin-table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Series</th>
            <th>Chapter</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {chapters.length === 0 && (
            <tr>
              <td colSpan={4} style={{ color: "var(--muted)" }}>
                No chapters yet.
              </td>
            </tr>
          )}
          {chapters.map((c) => {
            const isProse = c.series.type === "novel";
            return (
              <tr key={c.id}>
                <td>{c.series.title}</td>
                <td>
                  {Number(c.chapter_number)}
                  {c.title ? ` — ${c.title}` : ""}
                </td>
                <td>
                  <span
                    className={`badge ${isProse ? "badge-gold" : "badge-red"}`}
                  >
                    {c.series.type.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <form action={deleteChapter} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={c.id} />
                    <button
                      className="icon-button"
                      type="submit"
                      title="Delete"
                    >
                      &#128465;
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
