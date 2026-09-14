import { getJSON, putJSON } from "@/lib/b2";

const CONTENT_KEY = "content/site.json";

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
  await putJSON(CONTENT_KEY, next);
  return next;
}
