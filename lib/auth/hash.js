import { hash, verify } from "@node-rs/argon2";

const options = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
  saltLength: 16,
};

export function hashPassword(password) {
  if (!password) {
    throw new Error("Password is required for hashing");
  }
  return hash(password, options);
}

export function verifyPassword(hashedPassword, password) {
  if (!hashedPassword || !password) {
    return false;
  }
  return verify(hashedPassword, password, options);
}
