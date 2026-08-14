import { NextResponse } from "next/server";

export async function POST() {
  // TODO (Phase 5+): create a PayPal order server-side using the cart contents (never trust client-provided totals).
  return NextResponse.json({ error: "Not implemented yet" }, { status: 501 });
}
