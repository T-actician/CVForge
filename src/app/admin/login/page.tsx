"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Lock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "forgot" | "sent";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyAdmin = async (emailToCheck: string) => {
    const res = await fetch("/api/admin/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailToCheck }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Could not verify this email right now.");
    return data.registered as boolean;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const registered = await verifyAdmin(email);
      if (!registered) {
        setError("This email is not registered as an admin.");
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const registered = await verifyAdmin(email);
      if (!registered) {
        setError("This email is not registered as an admin.");
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (resetError) {
        setError("Could not send reset email. Try again.");
        setLoading(false);
        return;
      }

      setMode("sent");
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brown-900)] text-[var(--gold-light)]">
            <FileText size={18} strokeWidth={1.75} />
          </span>
          <span className="font-display text-xl text-[var(--brown-900)]">Vitae</span>
        </div>

        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-8">
          {mode === "sent" ? (
            <div className="text-center">
              <CheckCircle2 size={28} className="text-[var(--gold-dark)] mx-auto mb-3" />
              <p className="font-display text-[19px] text-[var(--brown-900)] mb-2">
                Check your email
              </p>
              <p className="text-[13.5px] text-[var(--brown-500)] leading-relaxed">
                We sent a password reset link to <strong>{email}</strong>.
                Please check your inbox — and your spam folder, just in case.
              </p>
              <button
                onClick={() => {
                  setMode("login");
                  setPassword("");
                }}
                className="mt-6 text-[13.5px] text-[var(--gold-dark)] hover:text-[var(--brown-900)]"
              >
                ← Back to login
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1.5">
                <Lock size={16} className="text-[var(--gold-dark)]" />
                <p className="font-display text-[19px] text-[var(--brown-900)]">
                  {mode === "login" ? "Admin Login" : "Reset Password"}
                </p>
              </div>
              <p className="text-[13px] text-[var(--brown-500)] mb-6">
                {mode === "login"
                  ? "Sign in to customize the site's hero and background content."
                  : "Enter your admin email and we'll send you a reset link."}
              </p>

              <form
                onSubmit={mode === "login" ? handleLogin : handleForgotPassword}
                className="space-y-4"
              >
                <label className="block">
                  <span className="block text-[12px] text-[var(--brown-500)] mb-1">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[var(--gold)]"
                  />
                </label>

                {mode === "login" && (
                  <label className="block">
                    <span className="block text-[12px] text-[var(--brown-500)] mb-1">Password</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[var(--gold)]"
                    />
                  </label>
                )}

                {error && <p className="text-[12.5px] text-[#a5473a]">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] py-2.5 text-[14.5px] text-white hover:brightness-105 transition disabled:opacity-60"
                >
                  {loading
                    ? mode === "login"
                      ? "Signing in…"
                      : "Sending…"
                    : mode === "login"
                    ? "Log In"
                    : "Send Reset Link"}
                </button>
              </form>

              <button
                onClick={() => {
                  setMode(mode === "login" ? "forgot" : "login");
                  setError("");
                }}
                className="block mx-auto mt-4 text-[13px] text-[var(--brown-500)] hover:text-[var(--gold-dark)]"
              >
                {mode === "login" ? "Forgot password?" : "← Back to login"}
              </button>
            </>
          )}
        </div>

        <Link href="/" className="block text-center mt-6 text-[13px] text-[var(--brown-500)] hover:text-[var(--brown-900)]">
          ← Back to site
        </Link>
      </div>
    </main>
  );
}
