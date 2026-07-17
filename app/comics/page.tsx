import Header from "../components/Header";
import SeriesGrid from "../components/SeriesGrid";
import { prisma } from "../lib/prisma";

export default async function ComicsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  const seriesList = await prisma.series.findMany({
    where: {
      type: "comic",
      ...(q ? { title: { contains: q } } : {}),
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <>
      <Header active="comics" />
      <main>
        <h1 className="display" style={{ fontSize: 30, marginBottom: 20 }}>
          Comics
        </h1>
        <SeriesGrid seriesList={seriesList} />
      </main>
    </>
  );
}
