import { NextResponse } from "next/server";
import { runNewsletterDigest } from "@/lib/newsletter-digest";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

/**
 * Batches every product published since the last run into a single
 * newsletter email, instead of one email per product. Meant to be hit
 * on a schedule (e.g. Supabase pg_cron via pg_net) once the site has a
 * real public URL for the scheduler to call — see supabase/migrations.
 * The admin panel's "Send Newsletter Now" button runs the same logic
 * on demand (src/lib/newsletter-digest.ts).
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runNewsletterDigest();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("Newsletter digest failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Digest failed" },
      { status: 502 }
    );
  }
}
