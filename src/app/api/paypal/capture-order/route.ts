import { NextResponse } from "next/server";

export async function POST() {
  // TODO (Phase 5+): verify payment status with PayPal server-side before marking any order as paid.
  // Never trust a client-side "success" redirect alone.
  return NextResponse.json({ error: "Not implemented yet" }, { status: 501 });
}
