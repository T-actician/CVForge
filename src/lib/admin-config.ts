// Single source of truth for who is allowed to act as admin.
// Add/remove Supabase user IDs here — used by both middleware.ts (route
// protection) and API routes that require admin access.
export const ADMIN_USER_IDS = [
  // add your new Supabase user ID here after creating the new project
];
