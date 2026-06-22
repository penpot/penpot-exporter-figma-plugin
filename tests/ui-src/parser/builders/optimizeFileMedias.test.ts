import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PenpotContext } from '@ui/lib/types/penpotContext';
import { optimizeFileMedias } from '@ui/parser/builders/optimizeFileMedias';

vi.mock('@ui/context', () => ({
  sendMessage: vi.fn(),
  flushMessageQueue: vi.fn()
}));

vi.mock('@ui/parser', () => ({
  images: new Map()
}));

// optimizeImage relies on browser-only APIs (createImageBitmap, OffscreenCanvas)
// that don't exist in the node test env, so we stub them. These tests cover the
// pixel-release contract (the decoded bitmap is always closed), NOT the real
// decode/encode — that is verified manually.
type CanvasStubs = {
  createImageBitmap?: typeof createImageBitmap;
  OffscreenCanvas?: typeof OffscreenCanvas;
};

const closeSpy = vi.fn();
let convertToBlob: () => Promise<Blob>;

// A regular class so it can be invoked with `new` (arrow functions can't).
class OffscreenCanvasStub {
  getContext(): { drawImage: () => void } {
    return { drawImage: (): void => {} };
  }

  convertToBlob(): Promise<Blob> {
    return convertToBlob();
  }
}

const setupCanvasStubs = (): void => {
  closeSpy.mockClear();

  (globalThis as CanvasStubs).createImageBitmap = vi.fn().mockResolvedValue({
    width: 10,
    height: 20,
    close: closeSpy
  }) as unknown as typeof createImageBitmap;

  (globalThis as CanvasStubs).OffscreenCanvas =
    OffscreenCanvasStub as unknown as typeof OffscreenCanvas;
};

const fakeContext = {
  addFileMedia: vi.fn().mockReturnValue('uuid-1')
} as unknown as PenpotContext;

describe('optimizeFileMedias — decoded pixel release', () => {
  beforeEach(() => {
    setupCanvasStubs();
    convertToBlob = (): Promise<Blob> => Promise.resolve(new Blob(['webp']));
  });

  it('closes the decoded bitmap after encoding to free its pixels', async () => {
    await optimizeFileMedias(fakeContext, [['hash', new Uint8Array([1, 2, 3])]], 1);

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('closes the bitmap even when encoding fails', async () => {
    convertToBlob = (): Promise<Blob> => Promise.reject(new Error('encode failed'));

    await expect(
      optimizeFileMedias(fakeContext, [['hash', new Uint8Array([1, 2, 3])]], 1)
    ).rejects.toThrow();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
