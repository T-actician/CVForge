// One-time script to create the admin user in Supabase Auth.
// Run: node scripts/create-admin.mjs admin@example.com yourpassword
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error("Failed:", error.message);
  process.exit(1);
}

console.log("Admin user created:", data.user.email);
