import { randomUUID } from "crypto";
import { getJSON, putJSON, deleteObject } from "@/lib/b2";

const TRASH_KEY = "content/trash.json";

export interface TrashItem {
  id: string;
  key: string; // raw B2 object key
  field: string; // SiteConfig field this came from, e.g. "heroBackgroundImage"
  mediaType: "image";
  label: string; // human-readable, e.g. "Hero background image"
  deletedAt: string; // ISO timestamp
}

export async function getTrash(): Promise<TrashItem[]> {
  return getJSON<TrashItem[]>(TRASH_KEY, []);
}

export async function addToTrash(
  item: Omit<TrashItem, "id" | "deletedAt">
): Promise<TrashItem> {
  const trash = await getTrash();
  const entry: TrashItem = { ...item, id: randomUUID(), deletedAt: new Date().toISOString() };
  await putJSON(TRASH_KEY, [entry, ...trash]);
  return entry;
}

export async function removeFromTrashList(id: string): Promise<TrashItem[]> {
  const trash = await getTrash();
  const next = trash.filter((t) => t.id !== id);
  await putJSON(TRASH_KEY, next);
  return next;
}

// Restore: just removes the trash entry — caller is responsible for putting
// the key back into the live SiteConfig field.
export async function restoreFromTrash(id: string): Promise<TrashItem | null> {
  const trash = await getTrash();
  const item = trash.find((t) => t.id === id) ?? null;
  if (!item) return null;
  await removeFromTrashList(id);
  return item;
}

// Permanent delete: removes the B2 object itself, then drops the trash entry.
export async function permanentlyDelete(id: string): Promise<boolean> {
  const trash = await getTrash();
  const item = trash.find((t) => t.id === id);
  if (!item) return false;
  await deleteObject(item.key);
  await removeFromTrashList(id);
  return true;
}
