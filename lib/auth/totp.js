import { authenticator } from "otplib";
import { decryptSecret, encryptSecret } from "@/lib/security/encryption";

export function generateTotpSecret() {
  return authenticator.generateSecret();
}

export function encryptTotpSecret(secret) {
  return encryptSecret(secret);
}

export function verifyTotpCode(encryptedSecret, token) {
  if (!encryptedSecret || !token) return false;
  const secret = decryptSecret(encryptedSecret);
  if (!secret) return false;
  return authenticator.check(token, secret);
}

export function buildTotpUri({ secret, email, issuer = "KW&SC" }) {
  if (!secret || !email) return null;
  return authenticator.keyuri(email, issuer, secret);
}
