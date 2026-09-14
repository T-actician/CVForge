// One-time script to set a custom CORS rule on the B2 bucket that allows
// browser uploads (PUT) — the dashboard's simple CORS presets only cover
// downloads (GET), not uploads.
//
// Run: node scripts/set-b2-cors.mjs https://your-site.vercel.app
import { config } from "dotenv";
config({ path: ".env.local" });

const origin = process.argv[2];
if (!origin) {
  console.error("Usage: node scripts/set-b2-cors.mjs <origin, e.g. https://your-site.vercel.app>");
  process.exit(1);
}

const keyId = process.env.B2_KEY_ID;
const appKey = process.env.B2_APPLICATION_KEY;
const bucketName = process.env.B2_BUCKET_NAME;

if (!keyId || !appKey || !bucketName) {
  console.error("Missing B2_KEY_ID, B2_APPLICATION_KEY or B2_BUCKET_NAME in .env.local");
  process.exit(1);
}

const authRes = await fetch("https://api.backblazeb2.com/b2api/v3/b2_authorize_account", {
  headers: { Authorization: "Basic " + Buffer.from(`${keyId}:${appKey}`).toString("base64") },
});
const auth = await authRes.json();
if (!authRes.ok) {
  console.error("Authorize failed:", auth);
  process.exit(1);
}

const listRes = await fetch(`${auth.apiInfo.storageApi.apiUrl}/b2api/v3/b2_list_buckets`, {
  method: "POST",
  headers: { Authorization: auth.authorizationToken, "Content-Type": "application/json" },
  body: JSON.stringify({ accountId: auth.accountId, bucketName }),
});
const list = await listRes.json();
if (!listRes.ok || !list.buckets?.length) {
  console.error("Could not find bucket:", list);
  process.exit(1);
}
const bucket = list.buckets[0];

const updateRes = await fetch(`${auth.apiInfo.storageApi.apiUrl}/b2api/v3/b2_update_bucket`, {
  method: "POST",
  headers: { Authorization: auth.authorizationToken, "Content-Type": "application/json" },
  body: JSON.stringify({
    accountId: auth.accountId,
    bucketId: bucket.bucketId,
    bucketType: bucket.bucketType,
    corsRules: [
      {
        corsRuleName: "allowUploadsFromSite",
        allowedOrigins: [origin, "http://localhost:3000"],
        allowedOperations: ["s3_put", "s3_get", "s3_head", "s3_post", "s3_delete"],
        allowedHeaders: ["*"],
        exposeHeaders: ["ETag"],
        maxAgeSeconds: 3600,
      },
    ],
  }),
});
const update = await updateRes.json();
if (!updateRes.ok) {
  console.error("Update failed:", update);
  process.exit(1);
}

console.log("CORS rule set successfully for:", origin);
