import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "../components/Header";
import SeriesGrid from "../components/SeriesGrid";
import { prisma } from "../lib/prisma";
import { getCurrentUser } from "../lib/auth";

export default async function MyLibraryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const bookmarks = await prisma.bookmarks.findMany({
    where: { user_id: user.id },
    include: { series: true },
    orderBy: { created_at: "desc" },
  });

  const seriesList = bookmarks.map((b) => b.series);

  return (
    <>
      <Header active="novels" />
      <main>
        <h1 className="display" style={{ fontSize: 30, marginBottom: 20 }}>
          My Library
        </h1>
        <SeriesGrid seriesList={seriesList} />
      </main>
    </>
  );
}
