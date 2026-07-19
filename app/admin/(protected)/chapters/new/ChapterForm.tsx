"use client";

import RichTextEditor from "@/app/components/RichTextEditor";
import { useState } from "react";

type SeriesOption = { id: number; title: string; type: string };

export default function ChapterForm({
  seriesList,
  action,
}: {
  seriesList: SeriesOption[];
  action: (FormData: FormData) => void;
}) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <form
      action={action}
      className="form-card"
      style={{ marginTop: 20, maxWidth: 560 }}
    >
      <label className="field-label">Series</label>
      <select
        className="field"
        name="series_id"
        required
        onChange={(e) => {
          const opt = seriesList.find((s) => s.id === Number(e.target.value));
          setSelectedType(opt?.type ?? null);
        }}
        defaultValue=""
      >
        <option value="" disabled>
          Select a series...
        </option>
        {seriesList.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title} ({s.type})
          </option>
        ))}
      </select>

      <div className="field-row">
        <div>
          <label className="field-label">Chapter number</label>
          <input
            className="field"
            type="text"
            name="chapter_number"
            placeholder="1"
            required
          />
        </div>
        <div>
          <label className="field-label">Chapter title (optional)</label>
          <input
            className="field"
            type="text"
            name="title"
            placeholder="A Dept of Ash"
          />
        </div>
      </div>

      {selectedType === "novel" && (
        <>
          <label className="field-label">Chapter text</label>
          <RichTextEditor name="body" />
        </>
      )}

      {selectedType === "comic" && (
        <>
          <label className="field-label">Page images</label>
          <input
            className="field"
            type="file"
            name="pages"
            multiple
            accept="image/*"
          />
          <p
            style={{
              color: "var(--faint)",
              fontSize: 11.5,
              margin: "-8px 0 14px",
            }}
          >
            Select files in reading order.
          </p>
        </>
      )}

      {!selectedType && (
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 14 }}>
          Pick a series above to continue.
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          className="btn btn-primary"
          style={{ ["--accent" as any]: "var(--gold)" }}
          type="submit"
        >
          Publish chapter
        </button>
      </div>
    </form>
  );
}
