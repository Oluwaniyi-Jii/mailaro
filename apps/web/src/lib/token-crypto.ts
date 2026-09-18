import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";

function getTokenKey() {
  const secret = process.env.TOKEN_ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("TOKEN_ENCRYPTION_KEY or NEXTAUTH_SECRET is required");
  }

  return createHash("sha256").update(secret).digest();
}

export function encryptToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getTokenKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    "v1",
    iv.toString("base64url"),
    authTag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

export function decryptToken(encryptedToken: string | null | undefined) {
  if (!encryptedToken) {
    return null;
  }

  const [version, iv, authTag, ciphertext] = encryptedToken.split(".");

  if (version !== "v1" || !iv || !authTag || !ciphertext) {
    throw new Error("Unsupported encrypted token format");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getTokenKey(),
    Buffer.from(iv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
