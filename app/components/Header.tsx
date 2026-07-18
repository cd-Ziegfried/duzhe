import Link from "next/link";
import { getCurrentUser } from "../lib/auth";
import { destroySession } from "../lib/session";
import { redirect } from "next/navigation";

async function logout() {
  "use server";
  await destroySession();
  redirect("/novels");
}

export default async function Header({
  active,
}: {
  active: "novels" | "comics";
}) {
  const user = await getCurrentUser();

  return (
    <header className="site-header">
      <Link href="/novels" className="logo display">
        Duzhe
      </Link>
      <div className="filters">
        <Link href="/novels" className={active === "novels" ? "active" : ""}>
          Novels
        </Link>
        <Link href="/comics" className={active === "comics" ? "active" : ""}>
          Comics
        </Link>
        <Link href="/library" className={active === "library" ? "active" : ""}>
          My Library
        </Link>
      </div>
      {user ? (
        <form
          action={logout}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <span style={{ color: "var(--muted)", fontSize: 13 }}>
            {user.display_name}
          </span>
          <button className="btn btn-ghost" type="submit">
            Log out
          </button>
        </form>
      ) : (
        <Link className="btn btn-ghost" href="/login">
          Log in
        </Link>
      )}
    </header>
  );
}
