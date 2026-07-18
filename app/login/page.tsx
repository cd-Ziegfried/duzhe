import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";
import { createSession } from "../lib/session";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const user = await prisma.users.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    redirect("/login?error=1");
  }

  await createSession(user.id);
  redirect("/novels");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="login-shell">
      <p className="display" style={{ fontSize: 24, marginBottom: 20 }}>
        Log in
      </p>
      {error && (
        <div className="flash-error">Email and password don&apos;t match.</div>
      )}
      <form action={login} className="form-card">
        <label className="field-label">Email</label>
        <input className="field" type="email" name="email" required />
        <label className="field-label">Password</label>
        <input className="field" type="password" name="password" required />
        <button
          className="btn btn-primary"
          style={{
            ["--accent" as any]: "var(--gold)",
            width: "100%",
            justifyContent: "center",
          }}
          type="submit"
        >
          Log in
        </button>
      </form>
      <p
        style={{
          color: "var(--muted)",
          fontSize: 13,
          marginTop: 14,
          textAlign: "center",
        }}
      >
        No account?{" "}
        <a href="/register" style={{ color: "var(--gold)" }}>
          Sign up
        </a>
      </p>
    </div>
  );
}
