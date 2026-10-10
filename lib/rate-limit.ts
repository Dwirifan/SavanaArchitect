type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  let b = store.get(key);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    store.set(key, b);
  }
  b.count++;
  const remaining = Math.max(0, limit - b.count);
  const ok = b.count <= limit;
  // periodic cleanup to avoid memory leak (sweep 1 in 200 calls)
  if (Math.random() < 0.005) {
    for (const [k, v] of store) if (now > v.resetAt) store.delete(k);
  }
  return { ok, remaining, resetAt: b.resetAt };
}

export function getIP(req: Request): string {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}
