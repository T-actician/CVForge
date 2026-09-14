"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Lock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // The recovery link sets a session automatically on load.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        setEmail(data.session.user.email);
      }
      setReady(true);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Reject reuse of the current password.
    const { error: sameCheck } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!sameCheck) {
      setError("New password must be different from your current password.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("Could not update password. The reset link may have expired.");
      return;
    }

    await supabase.auth.signOut();
    setDone(true);
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
          {done ? (
            <div className="text-center">
              <CheckCircle2 size={28} className="text-[var(--gold-dark)] mx-auto mb-3" />
              <p className="font-display text-[19px] text-[var(--brown-900)] mb-2">
                Password updated
              </p>
              <p className="text-[13.5px] text-[var(--brown-500)] mb-6">
                Your password has been changed successfully.
              </p>
              <Link
                href="/admin/login"
                className="inline-block rounded-md bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] px-6 py-2.5 text-[14px] text-white hover:brightness-105 transition"
              >
                Go back to login
              </Link>
            </div>
          ) : !ready ? (
            <p className="text-[13.5px] text-[var(--brown-500)] text-center">Loading…</p>
          ) : !email ? (
            <div className="text-center">
              <p className="text-[13.5px] text-[var(--brown-500)]">
                This reset link is invalid or has expired.
              </p>
              <Link
                href="/admin/login"
                className="block mt-4 text-[13px] text-[var(--gold-dark)] hover:text-[var(--brown-900)]"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1.5">
                <Lock size={16} className="text-[var(--gold-dark)]" />
                <p className="font-display text-[19px] text-[var(--brown-900)]">
                  Set a new password
                </p>
              </div>
              <p className="text-[13px] text-[var(--brown-500)] mb-6">
                Resetting password for <strong>{email}</strong>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="block text-[12px] text-[var(--brown-500)] mb-1">
                    New password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[var(--gold)]"
                  />
                </label>
                <label className="block">
                  <span className="block text-[12px] text-[var(--brown-500)] mb-1">
                    Confirm new password
                  </span>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[var(--gold)]"
                  />
                </label>
                {error && <p className="text-[12.5px] text-[#a5473a]">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] py-2.5 text-[14.5px] text-white hover:brightness-105 transition disabled:opacity-60"
                >
                  {loading ? "Updating…" : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
