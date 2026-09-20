"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, LogOut, Save, Check, Trash2 } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { createClient } from "@/lib/supabase/client";
import ImageUploadField from "@/components/admin/ImageUploadField";
import VideoUploadField from "@/components/admin/VideoUploadField";
import TrashPanel from "@/components/admin/TrashPanel";
import HeroCvEditor from "@/components/admin/HeroCvEditor";
import TemplatesPanel from "@/components/admin/TemplatesPanel";

const TEXT_FIELDS: { key: keyof SiteConfig; label: string; type: "text" | "textarea" }[] = [
  { key: "heroEyebrow", label: "Eyebrow label (above headline)", type: "text" },
  { key: "heroHeading", label: "Headline — line 1", type: "text" },
  { key: "heroHeadingAccent", label: "Headline — line 2 (gold accent)", type: "text" },
  { key: "heroSubheading", label: "Subheading", type: "textarea" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [tab, setTab] = useState<"content" | "trash" | "templates">("content");

  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then(setConfig);
  }, []);

  const handleChange = (key: keyof SiteConfig, value: string) => {
    if (!config) return;
    setConfig({ ...config, [key]: value });
    setSaved(false);
  };

  const handleCvChange = (cv: SiteConfig["heroCV"]) => {
    if (!config) return;
    setConfig({ ...config, heroCV: cv });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setSaved(true);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (!config) {
    return (
      <main className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <p className="text-[14px] text-[var(--brown-500)]">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--cream)]">
      <header className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brown-900)] text-[var(--gold-light)]">
            <FileText size={18} strokeWidth={1.75} />
          </span>
          <span className="font-display text-xl text-[var(--brown-900)]">Vitae Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[13.5px] text-[var(--brown-500)] hover:text-[var(--brown-900)] transition-colors duration-150"
          >
            View site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13.5px] text-[var(--brown-500)] transition-all duration-150 hover:bg-[#a5473a]/10 hover:text-[#a5473a] active:scale-95"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </header>

      <div className={`mx-auto px-6 sm:px-10 py-12 ${tab === "templates" ? "max-w-5xl" : "max-w-2xl"}`}>
        <div className="flex items-center gap-1 mb-8 border-b border-[var(--line)]">
          <button
            type="button"
            onClick={() => setTab("content")}
            className={`px-4 py-2.5 text-[13.5px] border-b-2 -mb-px transition-colors ${
              tab === "content"
                ? "border-[var(--gold)] text-[var(--brown-900)]"
                : "border-transparent text-[var(--brown-300)] hover:text-[var(--brown-700)]"
            }`}
          >
            Content
          </button>
          <button
            type="button"
            onClick={() => setTab("trash")}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[13.5px] border-b-2 -mb-px transition-colors ${
              tab === "trash"
                ? "border-[var(--gold)] text-[var(--brown-900)]"
                : "border-transparent text-[var(--brown-300)] hover:text-[var(--brown-700)]"
            }`}
          >
            <Trash2 size={13} />
            Trash
          </button>
          <button
            type="button"
            onClick={() => setTab("templates")}
            className={`px-4 py-2.5 text-[13.5px] border-b-2 -mb-px transition-colors ${
              tab === "templates"
                ? "border-[var(--gold)] text-[var(--brown-900)]"
                : "border-transparent text-[var(--brown-300)] hover:text-[var(--brown-700)]"
            }`}
          >
            Templates
          </button>
        </div>

        {tab === "trash" ? (
          <TrashPanel />
        ) : tab === "templates" ? (
          <TemplatesPanel />
        ) : (
          <>
        <h1 className="font-display text-3xl text-[var(--brown-900)] mb-2">
          Homepage Content
        </h1>
        <p className="text-[14px] text-[var(--brown-500)] mb-8">
          Changes apply immediately to the live homepage.
        </p>

        <div className="space-y-6">
          <ImageUploadField
            label="Hero background image"
            value={config.heroBackgroundImage}
            onChange={(url) => handleChange("heroBackgroundImage", url)}
            folder="site-hero"
            fieldKey="heroBackgroundImage"
          />

          <VideoUploadField
            label='"Watch How It Works" video'
            value={config.howItWorksVideoUrl}
            onChange={(url) => handleChange("howItWorksVideoUrl", url)}
            fieldKey="howItWorksVideoUrl"
          />

          {TEXT_FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="block text-[13px] text-[var(--brown-700)] mb-1.5">
                {f.label}
              </span>
              {f.type === "textarea" ? (
                <textarea
                  value={config[f.key] as string}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--gold)] resize-none"
                />
              ) : (
                <input
                  value={config[f.key] as string}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--gold)]"
                />
              )}
            </label>
          ))}

          <ImageUploadField
            label="How It Works section background image"
            value={config.howItWorksBackgroundImage}
            onChange={(url) => handleChange("howItWorksBackgroundImage", url)}
            folder="site-how-it-works"
            fieldKey="howItWorksBackgroundImage"
          />
        </div>

        <h2 className="font-display text-2xl text-[var(--brown-900)] mt-10 mb-1">
          Hero Mockup CV
        </h2>
        <p className="text-[13.5px] text-[var(--brown-500)] mb-2">
          This is the sample CV shown on the homepage. Every field is editable.
        </p>
        <HeroCvEditor cv={config.heroCV} onChange={handleCvChange} />

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] px-6 py-3 text-[14.5px] text-white hover:brightness-105 transition disabled:opacity-60"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
        </button>
        {saveError && (
          <p className="mt-3 text-[13px] text-[#a5473a]">{saveError}</p>
        )}
          </>
        )}
      </div>
    </main>
  );
}
