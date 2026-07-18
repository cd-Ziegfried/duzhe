import { prisma } from "@/app/lib/prisma";
import { createSession } from "@/app/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const user = await prisma.users.findUnique({ where: { email } });

  if (
    !user ||
    user.role !== "admin" ||
    !(await bcrypt.compare(password, user.password_hash))
  ) {
    redirect("/admin/login?error=1");
  }

  await createSession(user.id);
  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="login-shell">
      <p className="display" style={{ fontSize: 24, marginBottom: 20 }}>
        Duzhe admin
      </p>
      {error && (
        <div className="flash-error">
          That email and password don&apos;t match an admin account.
        </div>
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
    </div>
  );
}
