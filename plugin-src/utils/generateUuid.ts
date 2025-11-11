/**
 * This implementation uses the uuid library with a custom random number generator
 * based on Math.random() since crypto.getRandomValues() is not available in the
 * Figma plugin sandbox environment.
 *
 * Note: This is not cryptographically secure, but is sufficient for generating unique
 * identifiers in the Figma plugin context.
 */
import { v4 as uuidv4 } from 'uuid';

import type { Uuid } from '@ui/lib/types/utils/uuid';

/**
 * Custom random number generator for uuid library
 * Uses Math.random() instead of crypto.getRandomValues()
 */
const customRandom = (): Uint8Array => {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
};

export const generateUuid = (): Uuid => {
  return uuidv4({ random: customRandom() });
};
