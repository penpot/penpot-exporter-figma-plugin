import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PenpotContext } from '@ui/lib/types/penpotContext';
import { images, skippedImages } from '@ui/parser';
import { optimizeFileMedias } from '@ui/parser/builders/optimizeFileMedias';

vi.mock('@ui/context', () => ({
  sendMessage: vi.fn(),
  flushMessageQueue: vi.fn()
}));

vi.mock('@ui/parser', () => ({
  images: new Map(),
  skippedImages: new Set()
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
    images.clear();
    skippedImages.clear();
    vi.mocked(fakeContext.addFileMedia).mockReset().mockReturnValue('uuid-1');
    setupCanvasStubs();
    convertToBlob = (): Promise<Blob> => Promise.resolve(new Blob(['webp']));
  });

  it('closes the decoded bitmap after encoding to free its pixels', async () => {
    await optimizeFileMedias(fakeContext, [['hash', new Uint8Array([1, 2, 3])]], 1);

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('skips an image when encoding fails and still closes its bitmap', async () => {
    convertToBlob = (): Promise<Blob> => Promise.reject(new Error('encode failed'));

    await expect(
      optimizeFileMedias(fakeContext, [['hash', new Uint8Array([1, 2, 3])]], 1)
    ).resolves.toBeUndefined();

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(skippedImages.has('hash')).toBe(true);
    expect(images.has('hash')).toBe(false);
  });

  it('skips only the image that fails to decode', async () => {
    vi.mocked(createImageBitmap)
      .mockRejectedValueOnce(new Error('decode failed'))
      .mockResolvedValueOnce({ width: 10, height: 20, close: closeSpy } as ImageBitmap);

    await expect(
      optimizeFileMedias(
        fakeContext,
        [
          ['bad-hash', new Uint8Array([1])],
          ['good-hash', new Uint8Array([2])]
        ],
        1
      )
    ).resolves.toBeUndefined();

    expect(images.has('good-hash')).toBe(true);
    expect(images.has('bad-hash')).toBe(false);
    expect(skippedImages.has('bad-hash')).toBe(true);
    expect(fakeContext.addFileMedia).toHaveBeenCalledTimes(1);
  });

  it('still rejects when adding file media fails', async () => {
    vi.mocked(fakeContext.addFileMedia).mockRejectedValue(new Error('media failed'));

    await expect(
      optimizeFileMedias(fakeContext, [['hash', new Uint8Array([1, 2, 3])]], 1)
    ).rejects.toThrow('media failed');
  });
});
