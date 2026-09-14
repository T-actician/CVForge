import { createClient } from "@/lib/supabase/server";
import { ADMIN_USER_IDS } from "@/lib/admin-config";

export async function requireAdmin() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Only the designated admin account(s) may act as admin — any other
    // authenticated Supabase user is treated as unauthorized too.
    if (!ADMIN_USER_IDS.includes(user.id)) return null;

    return user;
  } catch (err) {
    console.error("requireAdmin failed:", err);
    return null;
  }
}
