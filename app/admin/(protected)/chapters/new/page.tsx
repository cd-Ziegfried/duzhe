import { prisma } from "@/app/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import { redirect } from "next/navigation";
import path from "path";
import ChapterForm from "./ChapterForm";

async function publishChapter(formData: FormData) {
  "use server";

  const seriesId = Number(formData.get("series_id"));
  const chapterNumber = String(formData.get("chapter_number"));
  const title = String(formData.get("title") || "") || null;

  const series = await prisma.series.findUnique({ where: { id: seriesId } });
  if (!series) throw new Error("Series not found");

  const chapter = await prisma.chapters.create({
    data: { series_id: seriesId, chapter_number: chapterNumber, title },
  });

  if (series.type === "novel") {
    const body = String(formData.get("body") || "");
    await prisma.chapter_text.create({
      data: { chapter_id: chapter.id, body },
    });
  } else {
    const files = formData.getAll("pages") as File[];
    const uploadDir = path.join(process.cwd(), "public", "uploads", "pages");
    await mkdir(uploadDir, { recursive: true });

    let pageNumber = 1;
    for (const file of files) {
      if (!file.size) continue;
      const ext = file.name.split(".").pop();
      const filename = `chapter${chapter.id}_page${pageNumber}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);

      await prisma.chapter_pages.create({
        data: {
          chapter_id: chapter.id,
          page_number: pageNumber,
          image_url: `/uploads/pages/${filename}`,
        },
      });
      pageNumber++;
    }
  }
  redirect("/admin/chapters");
}

export default async function NewChapterPage() {
  const seriesList = await prisma.series.findMany({
    select: { id: true, title: true, type: true },
    orderBy: { title: "asc" },
  });

  return (
    <div>
      <h1 className="page-title display">Chapters</h1>
      <p className="page-sub">Publish a new chapter to an existing series.</p>
      <ChapterForm seriesList={seriesList} action={publishChapter} />
    </div>
  );
}
