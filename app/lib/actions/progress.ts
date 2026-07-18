"use server";

import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";

export async function saveProgress(
  seriesId: number,
  chapterId: number,
  percent: number,
) {
  const user = await getCurrentUser();
  if (!user) return;

  await prisma.reading_progress.upsert({
    where: { user_id_series_id: { user_id: user.id, series_id: seriesId } },
    update: { chapter_id: chapterId, scroll_percent: percent },
    create: {
      user_id: user.id,
      series_id: seriesId,
      chapter_id: chapterId,
      scroll_percent: percent,
    },
  });
}
