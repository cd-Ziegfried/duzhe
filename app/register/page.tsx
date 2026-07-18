import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";

async function register(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const displayName = String(formData.get("display_name") || "").trim();

  if (!email || !password || !displayName) {
    redirect("/register?error=missing");
  }

  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) {
    redirect("/register?error=taken");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      email,
      password_hash: passwordHash,
      display_name: displayName,
      role: "reader",
    },
  });

  await createSession(user.id);
  redirect("/novels");
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const message =
    error === "taken"
      ? "That email is already registed."
      : error === "missing"
        ? "Fill in every field."
        : null;

  return (
    <div className="login-shell">
      <p className="display" style={{ fontSize: 24, marginBottom: 20 }}>
        Create an account
      </p>
      {message && <div className="flash-error">{message}</div>}
      <form action={register} className="form-card">
        <label className="field-label">Display name</label>
        <input className="field" type="text" name="display_name" required />
        <label className="field-label">Email</label>
        <input className="field" type="email" name="email" required />
        <label className="field-label">Password</label>
        <input
          className="field"
          type="password"
          name="password"
          required
          minLength={8}
        />
        <button
          className="btn btn-primary"
          style={{
            ["--accent" as any]: "var(--gold)",
            width: "100%",
            justifyContent: "center",
          }}
          type="submit"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
