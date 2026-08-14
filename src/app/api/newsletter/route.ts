import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // TODO (Phase 3+): store subscriber via chosen newsletter provider (Brevo/Mailchimp), rate limit this endpoint.
  return NextResponse.json({ error: "Not implemented yet" }, { status: 501 });
}
