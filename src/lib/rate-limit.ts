import "server-only";

export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

const WINDOW_MS = 10 * 60 * 1000;
const buckets = new Map<string, number[]>();

/**
 * In-memory sliding-window limiter. Good enough for a single-instance
 * deployment on our budget; resets on cold start and isn't shared across
 * instances, but stops naive scripted abuse without adding infra.
 */
export function isRateLimited(key: string, maxRequests: number): boolean {
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= maxRequests) {
    buckets.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return false;
}
