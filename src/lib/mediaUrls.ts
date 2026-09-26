// Bucket is private — everything is served through /api/media/[...key].
// Pure functions only — safe to import from both Node and Edge runtimes.

export function toMediaUrl(key: string): string {
  return key ? `/api/media/${encodeURIComponent(key)}` : "";
}

export function toDownloadUrl(key: string, filename?: string): string {
  if (!key) return "";
  const qs = new URLSearchParams({ dl: "1", name: filename || key.split("/").pop()! });
  return `/api/media/${encodeURIComponent(key)}?${qs.toString()}`;
}

// Reverses toMediaUrl(): turns "/api/media/photos%2Fabc.webp" (with or
// without a query string) back into the raw B2 object key "photos/abc.webp".
export function mediaUrlToKey(mediaUrl: string): string {
  if (!mediaUrl) return "";
  const withoutQuery = mediaUrl.split("?")[0];
  const encoded = withoutQuery.replace(/^\/api\/media\//, "");
  return decodeURIComponent(encoded);
}
