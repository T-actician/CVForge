function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
  );
}

// amount: -1 (fully black) to +1 (fully white), 0 = unchanged
function shade(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const target = amount > 0 ? 255 : 0;
  const pct = Math.abs(amount);
  return rgbToHex([
    r + (target - r) * pct,
    g + (target - g) * pct,
    b + (target - b) * pct,
  ]);
}

// Given one accent color an admin picks, derive the three tonal variants the
// templates need: a mid tone for borders/dividers, a darker tone for text on
// light backgrounds, and a lighter tone for text on dark backgrounds.
export function deriveAccentShades(base: string) {
  return {
    accent: base,
    accentDark: shade(base, -0.28),
    accentLight: shade(base, 0.35),
  };
}
