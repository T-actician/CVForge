import { getJSON, putJSON } from "@/lib/b2";
import { mediaUrlToKey } from "@/lib/mediaUrls";
import { addToTrash } from "@/lib/trash";

const CONTENT_KEY = "content/site.json";

// Every media field on SiteConfig, so replacing or clearing one moves the
// previous file into Trash instead of silently orphaning it in B2.
export const MEDIA_FIELDS: Record<
  string,
  { mediaType: "image" | "video"; label: string }
> = {
  heroBackgroundImage: { mediaType: "image", label: "Hero background image" },
  howItWorksBackgroundImage: {
    mediaType: "image",
    label: "How It Works section background image",
  },
  howItWorksVideoUrl: { mediaType: "video", label: '"Watch How It Works" video' },
};

export interface SiteConfig {
  heroEyebrow: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroSubheading: string;
  heroBackgroundImage: string; // stores a B2 object key, not a URL
  heroPersonName: string;
  heroPersonTitle: string;
  howItWorksBackgroundImage: string; // stores a B2 object key, not a URL
  howItWorksVideoUrl: string; // media proxy path (/api/media/videos%2F...)
}

const DEFAULTS: SiteConfig = {
  heroEyebrow: "YOUR FUTURE. WELL PRESENTED.",
  heroHeading: "Create a Professional",
  heroHeadingAccent: "CV in Minutes",
  heroSubheading:
    "Choose from elegant, ATS-friendly templates, customize with your details, and download a professional CV that helps you stand out.",
  heroBackgroundImage: "",
  heroPersonName: "Daniel Mwangi",
  heroPersonTitle: "Software Engineer",
  howItWorksBackgroundImage: "",
  howItWorksVideoUrl: "",
};

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const stored = await getJSON<Partial<SiteConfig>>(CONTENT_KEY, {});
    return { ...DEFAULTS, ...stored };
  } catch (err) {
    console.error("getSiteConfig failed, using defaults:", err);
    return DEFAULTS;
  }
}

export async function saveSiteConfig(
  update: Partial<SiteConfig>
): Promise<SiteConfig> {
  const current = await getSiteConfig();
  const next = { ...current, ...update };

  // Any media field whose value is being replaced or cleared: move the
  // previous file to Trash rather than losing the reference to it.
  for (const field of Object.keys(MEDIA_FIELDS) as (keyof SiteConfig)[]) {
    const meta = MEDIA_FIELDS[field as string];
    const oldValue = current[field] as string;
    const newValue = next[field] as string;
    if (oldValue && oldValue !== newValue) {
      const key = mediaUrlToKey(oldValue);
      if (key) {
        await addToTrash({
          key,
          field: field as string,
          mediaType: meta.mediaType,
          label: meta.label,
        });
      }
    }
  }

  await putJSON(CONTENT_KEY, next);
  return next;
}
