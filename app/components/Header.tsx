import Link from "next/link";

export default function Header({ active }: { active: "novels" | "comics" }) {
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
      </div>
    </header>
  );
}
