import { createClient } from "@supabase/supabase-js";
import { ADMIN_USER_IDS } from "@/lib/admin-config";

// Server-only client using the service role key.
// NEVER import this file from a Client Component.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function isRegisteredAdmin(email: string): Promise<boolean> {
  const admin = createAdminClient();
  const target = email.trim().toLowerCase();

  // Paginate through users looking for a match, and require that the
  // matching account is in the admin allowlist (src/lib/admin-config.ts).
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === target);
    if (match) return ADMIN_USER_IDS.includes(match.id);
    if (data.users.length < perPage) return false;
    page += 1;
  }
}
