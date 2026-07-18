import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function deleteSeries(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  await prisma.series.delete({ where: { id } });
  revalidatePath("/admin/series");
}

export default async function AdminSeriesList() {
  const seriesList = await prisma.series.findMany({
    include: { _count: { select: { chapters: true } } },
    orderBy: { created_at: "desc" },
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
          <h1 className="page-title display">Series</h1>
          <p className="page-sub">Manage every title in the library.</p>
        </div>
        <Link
          className="btn btn-primary"
          style={{ ["--accent" as any]: "var(--gold)" }}
          href="/admin/series/new"
        >
          {" "}
          + New Series
        </Link>
      </div>

      <table className="admin-table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Chapters</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {seriesList.length === 0 && (
            <tr>
              <td colSpan={5} style={{ color: "var(--muted)" }}>
                No Series yet.
              </td>
            </tr>
          )}
          {seriesList.map((s) => {
            const isProse = s.type === "novel";
            return (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>
                  <span
                    className={`badge ${isProse ? "badge-gold" : "badge-red"}`}
                  >
                    {s.type.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${s.status === "ongoing" ? "badge-green" : ""}`}
                  >
                    {s.type.toUpperCase()}
                  </span>
                </td>
                <td className="num">{s._count.chapters}</td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <Link
                    className="icon-btn"
                    href={`/admin/series/${s.id}/edit`}
                    title="Edit"
                  >
                    &#9998;
                  </Link>
                  <form action={deleteSeries} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="icon-btn" type="submit" title="Delete">
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
