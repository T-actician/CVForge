# CVForge

## Setup

1. Open a terminal in this folder.
2. Run: `npm install`
3. `.env.local` already contains your Supabase and Backblaze B2 keys (this file is gitignored — never commit it).
4. Create your admin login (one-time): `npm run create-admin -- youremail@example.com yourpassword`
5. Run: `npm run dev`
6. Open `http://localhost:3000` in your browser.

## Pages

- `/` — landing page
- `/templates` — choose a CV template
- `/builder` — fill in details, upload a photo, live preview, download PDF (also auto-saved to B2)
- `/admin/login` — admin login (Supabase Auth, email + password from step 4)
- `/admin/dashboard` — edit hero heading, subheading, eyebrow text, background image URL, and mockup name/title (protected — requires login)

## Storage

- **Supabase** — used only for admin login (Supabase Auth). No database tables required.
- **Backblaze B2** — stores uploaded profile photos (`photos/`) and generated PDF exports (`pdfs/`). Make sure the `TechticiansCv` bucket's files are set to public so the returned URLs load directly; otherwise switch `uploadToB2` in `src/lib/b2.ts` to generate signed URLs instead.

## Notes

- Admin homepage edits are stored in `data/site-config.json`.
- CV templates are in `src/components/cv-templates/`.
- Never commit `.env.local` — it holds live secret keys.
