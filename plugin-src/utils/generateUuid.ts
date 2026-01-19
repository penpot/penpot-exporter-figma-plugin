/**
 * This implementation uses the uuid library with a custom random number generator
 * based on Math.random() since crypto.getRandomValues() is not available in the
 * Figma plugin sandbox environment.
 *
 * Note: This is not cryptographically secure, but is sufficient for generating unique
 * identifiers in the Figma plugin context.
 */
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

import type { Uuid } from '@ui/lib/types/utils/uuid';

/**
 * A fixed namespace UUID for Penpot component keys.
 * This ensures the same component.key always generates the same UUID,
 * even across different Figma files.
 */
const PENPOT_COMPONENT_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

const randomBuffer = new Uint8Array(16);
const randomView = new DataView(randomBuffer.buffer);

/**
 * Custom random number generator for uuid library
 * Uses Math.random() instead of crypto.getRandomValues()
 * Reuses the same buffer to avoid memory allocation on each call
 */
const customRandom = (): Uint8Array => {
  randomView.setUint32(0, (Math.random() * 0x100000000) >>> 0, true);
  randomView.setUint32(4, (Math.random() * 0x100000000) >>> 0, true);
  randomView.setUint32(8, (Math.random() * 0x100000000) >>> 0, true);
  randomView.setUint32(12, (Math.random() * 0x100000000) >>> 0, true);

  return randomBuffer;
};

export const generateUuid = (): Uuid => {
  return uuidv4({ random: customRandom() });
};

/**
 * Generates a deterministic UUID based on a component key.
 * The same componentKey will always produce the same UUID,
 * even across different Figma files.
 */
export const generateDeterministicUuid = (componentKey: string): Uuid => {
  return uuidv5(componentKey, PENPOT_COMPONENT_NAMESPACE);
};
