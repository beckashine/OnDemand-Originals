import { NextResponse } from "next/server";

export async function POST() {
  // TODO (Phase 5+): verify PayPal webhook signature, update order payment status accordingly.
  return NextResponse.json({ error: "Not implemented yet" }, { status: 501 });
}
