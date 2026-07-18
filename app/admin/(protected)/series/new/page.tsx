import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import SeriesForm from "../SeriesForm";

function Slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function createSeries(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "");

  await prisma.series.create({
    data: {
      title,
      slug: Slugify(title),
      author: String(formData.get("author") || "") || null,
      synopsis: String(formData.get("synopsis") || "") || null,
      type: String(formData.get("type")) as any,
      status: String(formData.get("status")) as any,
    },
  });

  redirect("/admin/series");
}

export default function NewSeriesPage() {
  return (
    <div>
      <h1 className="page-title display">New series</h1>
      <p className="page-sub">Fill in the details, chapters come after.</p>
      <SeriesForm action={createSeries} />
    </div>
  );
}
