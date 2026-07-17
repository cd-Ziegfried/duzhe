import Header from "../components/Header";
import SeriesGrid from "../components/SeriesGrid";
import { prisma } from "../lib/prisma";

export default async function NovelsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = " " } = await searchParams;

  const seriesList = await prisma.series.findMany({
    where: {
      type: "novel",
      ...(q ? { title: { contains: q } } : {}),
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <>
      <Header active="novels" />
      <main>
        <h1 className="display" style={{ fontSize: 30, marginBottom: 20 }}>
          Novels
        </h1>
        <SeriesGrid seriesList={seriesList} />
      </main>
    </>
  );
}
