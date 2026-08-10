import { randomBytes } from 'crypto';
import { totp } from 'notp';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as b32 from 'thirty-two';

function generateOtpKey(): Buffer {
  // 20 cryptographically random binary bytes (160-bit key)
  const key = randomBytes(20);

  return key;
}

function encodeGoogleAuthKey(bin: Buffer) {
  // 32 ascii characters without trailing '='s
  const base32str = b32.encode(bin).toString('utf8').replace(/=/g, '');

  // lowercase with a space every 4 characters
  const key = base32str
    .toLowerCase()
    .replace(/(\w{4})/g, '$1 ')
    .trim();

  return key;
}

/**
 * Binary-decode the key from base32 (Google Authenticator, FB, M$, etc)
 * @param key
 */
function decodeGoogleAuthKey(key: string) {
  // decode base32 google auth key to binary
  const unformatted = key.replace(/\W+/g, '').toUpperCase();
  const bin = b32.decode(unformatted);

  return bin;
}

/**
 * Verify a legacy compatible 2FA token
 * @param key
 * @param token
 */
export function verifyToken(key: string, token: string) {
  const bin = decodeGoogleAuthKey(key);

  token = token.replace(/\W+/g, '');

  // window is +/- 1 period of 30 seconds
  return totp.verify(token, bin, { window: 1, time: 30 });
}

/**
 * Generate a 2FA token compatible with legacy format
 * @param key
 */
export function generateToken(key: string) {
  const bin = decodeGoogleAuthKey(key);
  return totp.gen(bin);
}

/**
 * Generate a 2FA key compatible with legacy format
 */
export function generateKey() {
  return encodeGoogleAuthKey(generateOtpKey());
}
