"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import TemplatePreview from "@/components/cv-templates/TemplatePreview";
import {
  AllTemplateSettings,
  TemplateSettings,
  FONT_OPTIONS,
  DEFAULT_TEMPLATE_SETTINGS,
} from "@/lib/templateSettings";

export default function TemplatesPanel() {
  const [settings, setSettings] = useState<AllTemplateSettings | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/template-settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => setError("Failed to load template settings."));
  }, []);

  const updateLocal = (id: string, patch: Partial<TemplateSettings>) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [id]: { ...(settings[id] ?? DEFAULT_TEMPLATE_SETTINGS), ...patch },
    });
    setSavedId(null);
  };

  const save = async (id: string) => {
    if (!settings) return;
    setSavingId(id);
    setError("");
    try {
      const res = await fetch("/api/admin/template-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: id, settings: settings[id] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setSettings(data);
      setSavedId(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingId(null);
    }
  };

  if (!settings) {
    return <p className="text-[14px] text-[var(--brown-500)]">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--brown-900)] mb-2">Templates</h1>
      <p className="text-[14px] text-[var(--brown-500)] mb-8">
        Live previews of every template. Customize the accent color and font, then save —
        changes apply to the public template gallery and the CV builder.
      </p>

      {error && <p className="mb-4 text-[13px] text-[#a5473a]">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((t) => {
          const s = settings[t.id] ?? DEFAULT_TEMPLATE_SETTINGS;
          return (
            <div key={t.id} className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-4">
              <div className="aspect-[3/4] rounded-md overflow-hidden border border-[var(--line)] mb-3">
                <TemplatePreview templateId={t.id} settings={s} />
              </div>
              <p className="text-[14.5px] text-[var(--brown-900)] font-medium mb-2">{t.name}</p>

              <label className="flex items-center justify-between text-[12.5px] text-[var(--brown-700)] mb-2">
                Accent color
                <input
                  type="color"
                  value={s.accentColor}
                  onChange={(e) => updateLocal(t.id, { accentColor: e.target.value })}
                  className="h-7 w-10 rounded border border-[var(--line)] cursor-pointer bg-transparent"
                />
              </label>

              <label className="block text-[12.5px] text-[var(--brown-700)] mb-3">
                Font
                <select
                  value={s.fontFamily}
                  onChange={(e) =>
                    updateLocal(t.id, { fontFamily: e.target.value as TemplateSettings["fontFamily"] })
                  }
                  className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-2.5 py-1.5 text-[13px] outline-none focus:border-[var(--gold)]"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => save(t.id)}
                disabled={savingId === t.id}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-[var(--brown-900)] px-3 py-2 text-[13px] text-white hover:brightness-110 transition disabled:opacity-60"
              >
                {savingId === t.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : savedId === t.id ? (
                  <Check size={13} />
                ) : null}
                {savingId === t.id ? "Saving…" : savedId === t.id ? "Saved" : "Save"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
