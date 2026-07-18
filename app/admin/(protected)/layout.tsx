import { requireAdmin } from "@/app/lib/auth";
import { destroySession } from "@/app/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

async function logout() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">
          <span className="logo display">Duzhe</span>
          <span className="badge">Admin</span>
        </div>
        <Link className="nav-item" href="/admin">
          Dashboard
        </Link>
        <Link className="nav-item" href="/admin/series">
          Series
        </Link>
        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <form action={logout}>
            <button
              className="nav-item"
              type="submit"
              style={{ cursor: "pointer" }}
            >
              &larr; Log out ({user.display_name})
            </button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
