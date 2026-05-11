import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function hashToken(token: string): Promise<string> {
  const encoded = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(digest));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function revokeToken(
  token: string,
  expiresInSeconds: number,
): Promise<void> {
  try {
    const key = `blocklist:${await hashToken(token)}`;
    await redis.set(key, "1", { ex: expiresInSeconds });
  } catch (error) {
    console.error("Failed to revoke token in Redis:", error);
  }
}

export async function isTokenRevoked(token: string): Promise<boolean> {
  try {
    const key = `blocklist:${await hashToken(token)}`;
    const result = await redis.get(key);
    return result !== null;
  } catch (error) {
    console.error("Failed to check token blocklist in Redis:", error);
    return false;
  }
}
