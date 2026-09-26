"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Trash2, Image as ImageIcon } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { toMediaUrl } from "@/lib/mediaUrls";

interface TrashItem {
  id: string;
  key: string;
  field: string;
  mediaType: "image";
  label: string;
  deletedAt: string;
}

export default function TrashPanel() {
  const [items, setItems] = useState<TrashItem[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmPermanent, setConfirmPermanent] = useState<TrashItem | null>(null);

  const load = () => {
    fetch("/api/admin/trash")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setError("Failed to load trash."));
  };

  useEffect(load, []);

  const handleRestore = async (item: TrashItem) => {
    setBusyId(item.id);
    setError("");
    try {
      const res = await fetch("/api/admin/trash/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Restore failed.");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Restore failed.");
    } finally {
      setBusyId(null);
    }
  };

  const handlePermanentDelete = async (item: TrashItem) => {
    setBusyId(item.id);
    setError("");
    try {
      const res = await fetch("/api/admin/trash/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      setConfirmPermanent(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  if (items === null) {
    return <p className="text-[14px] text-[var(--brown-500)]">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--brown-900)] mb-2">Trash</h1>
      <p className="text-[14px] text-[var(--brown-500)] mb-8">
        Deleted images stay here until you restore them or delete them permanently.
      </p>

      {error && <p className="mb-4 text-[13px] text-[#a5473a]">{error}</p>}

      {items.length === 0 ? (
        <p className="text-[14px] text-[var(--brown-300)]">Trash is empty.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-md border border-[var(--line)] bg-[var(--paper)] p-3"
            >
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-black flex items-center justify-center">
                <img src={toMediaUrl(item.key)} alt={item.label} className="h-full w-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="flex items-center gap-1.5 text-[13.5px] text-[var(--brown-900)]">
                  <ImageIcon size={13} />
                  {item.label}
                </p>
                <p className="text-[12px] text-[var(--brown-300)]">
                  Deleted {new Date(item.deletedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleRestore(item)}
                  disabled={busyId === item.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] px-3 py-2 text-[13px] text-[var(--brown-700)] hover:border-[var(--gold)] transition-colors disabled:opacity-60"
                >
                  <RotateCcw size={13} />
                  Restore
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmPermanent(item)}
                  disabled={busyId === item.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] px-3 py-2 text-[13px] text-[#a5473a] hover:border-[#a5473a] transition-colors disabled:opacity-60"
                >
                  <Trash2 size={13} />
                  Delete forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={confirmPermanent !== null}
        title="Delete this permanently?"
        message={`"${confirmPermanent?.label ?? ""}" will be permanently deleted from storage. This cannot be undone.`}
        confirmLabel="Delete forever"
        danger
        onConfirm={() => confirmPermanent && handlePermanentDelete(confirmPermanent)}
        onCancel={() => setConfirmPermanent(null)}
      />
    </div>
  );
}
