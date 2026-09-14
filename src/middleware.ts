import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_USER_IDS } from "@/lib/admin-config";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublicAdminPage = path === "/admin/login" || path === "/admin/reset-password";
  const isAdminArea = path.startsWith("/admin");
  const isAdmin = !!user && ADMIN_USER_IDS.includes(user.id);

  if (isAdminArea && !isPublicAdminPage && !isAdmin) {
    if (user) {
      await supabase.auth.signOut();
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "unauthorized");
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
    redirect.headers.set("Cache-Control", "no-store");
    return redirect;
  }

  if (path === "/admin/login" && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
