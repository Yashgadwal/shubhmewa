import crypto from "crypto";

/**
 * Hash a password using native SHA-256 with a random salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored salt:hash string.
 */
export function verifyPassword(password: string, storedValue: string): boolean {
  const parts = storedValue.split(":");
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  const verificationHash = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return hash === verificationHash;
}
