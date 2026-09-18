import { createHash, randomBytes, timingSafeEqual } from "crypto";

export const GMAIL_OAUTH_STATE_COOKIE = "mailaro_gmail_oauth_state";

export function createGmailOAuthState() {
  const state = randomBytes(32).toString("base64url");

  return {
    state,
    stateHash: hashOAuthState(state),
  };
}

export function hashOAuthState(state: string) {
  return createHash("sha256").update(state).digest("base64url");
}

export function isValidGmailOAuthState(state: string | null, expectedHash?: string) {
  if (!state || !expectedHash) {
    return false;
  }

  const actual = Buffer.from(hashOAuthState(state));
  const expected = Buffer.from(expectedHash);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function getGmailOAuthRedirectUri() {
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!baseUrl) {
    throw new Error("NEXTAUTH_URL is required for Gmail OAuth");
  }

  return `${baseUrl}/api/gmail/callback`;
}
