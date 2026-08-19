import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { addSubscriber } from "@/lib/brevo";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`newsletter:${ip}`, 5)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const { email } = await request.json();

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    await addSubscriber(email);
  } catch (err) {
    console.error("Newsletter signup failed:", err);
    return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 502 });
  }

  // Best-effort local record for our own reference — not the source of truth for sending.
  const supabase = createAdminClient();
  await supabase.from("subscribers").insert({ email });

  return NextResponse.json({ ok: true });
}
