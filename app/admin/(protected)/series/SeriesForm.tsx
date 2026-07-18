type SeriesFormData = {
  id?: number;
  title: string;
  author: string | null;
  synopsis: string | null;
  type: string;
  status: string;
};

export default function SeriesForm({
  series,
  action,
}: {
  series?: SeriesFormData;
  action: (formData: FormData) => void;
}) {
  return (
    <form
      action={action}
      className="form-card"
      style={{ marginTop: 20, maxWidth: 560 }}
    >
      {series?.id && <input type="hidden" name="id" value={series.id} />}

      <label className="field-label">Title</label>
      <input
        className="field"
        type="text"
        name="title"
        required
        defaultValue={series?.title}
      />

      <label className="field-label">Author</label>
      <input
        className="field"
        type="text"
        name="author"
        defaultValue={series?.author ?? ""}
      />

      <label className="field-label">Type</label>
      <div className="type-picker">
        {["novel", "comic"].map((t) => (
          <label
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "7px 12px",
              fontSize: 12,
              color: "var(--muted)",
            }}
          >
            <input
              type="radio"
              name="type"
              value={t}
              defaultChecked={series ? series.type === t : t === "novel"}
            />
            {t === "novel" ? "Novel" : "Comic"}
          </label>
        ))}
      </div>

      <label className="field-label">Status</label>
      <select
        className="field"
        name="status"
        defaultValue={series?.status ?? "ongoing"}
      >
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
        <option value="hiatus">Hiatus</option>
      </select>

      <label className="field-label">Synopsis</label>
      <textarea
        className="field"
        name="synopsis"
        rows={4}
        defaultValue={series?.synopsis ?? ""}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          className="btn btn-primary"
          style={{ ["==accent" as any]: "var(--gold)" }}
          type="submit"
        >
          {series?.id ? "Save changes" : "Create series"}
        </button>
      </div>
    </form>
  );
}
