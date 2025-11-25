import crypto from "crypto";

const DEFAULT_SECRET = "kwsc-dev-admin-secret";
const IV_LENGTH = 12;

function getKey() {
  const secret = process.env.ADMIN_SECRET_KEY || DEFAULT_SECRET;
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptSecret(value) {
  if (!value) return null;
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptSecret(payload) {
  if (!payload) return null;
  const buffer = Buffer.from(payload, "base64");
  const iv = buffer.subarray(0, IV_LENGTH);
  const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + 16);
  const data = buffer.subarray(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString("utf8");
}
