import { NextRequest, NextResponse } from "next/server";
import { isRegisteredAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    const registered = await isRegisteredAdmin(email);
    return NextResponse.json({ registered });
  } catch {
    return NextResponse.json({ error: "Could not verify email." }, { status: 500 });
  }
}
