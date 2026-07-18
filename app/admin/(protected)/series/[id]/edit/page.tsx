import { prisma } from "@/app/lib/prisma";
import { redirect, notFound } from "next/navigation";
import SeriesForm from "../../SeriesForm";

export default async function EditSeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seriesId = Number(id);

  const series = await prisma.series.findUnique({ where: { id: seriesId } });
  if (!series) notFound();

  async function updateSeries(formData: FormData) {
    "use server";

    await prisma.series.update({
      where: { id: seriesId },
      data: {
        title: String(formData.get("title") || ""),
        author: String(formData.get("author") || "") || null,
        synopsis: String(formData.get("synopsis") || "") || null,
        type: String(formData.get("type")) as any,
        status: String(formData.get("status")) as any,
      },
    });

    redirect("/admin/series");
  }

  return (
    <div>
      <h1 className="page-title display">Edit series</h1>
      <p className="page-sub">{series.title}</p>
      <SeriesForm series={series} action={updateSeries} />
    </div>
  );
}
