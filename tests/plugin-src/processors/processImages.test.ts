import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { images as ImagesMap } from '@plugin/libraries';
import type { processImages as ProcessImagesFn } from '@plugin/processors/processImages';

const mockPostMessage = vi.fn();

(globalThis as { figma?: typeof figma }).figma = {
  ui: { postMessage: mockPostMessage }
} as unknown as typeof figma;

const createImage = (bytes: Uint8Array): Image =>
  ({ getBytesAsync: vi.fn().mockResolvedValue(bytes) }) as unknown as Image;

const postedImageMessages = (): unknown[] =>
  mockPostMessage.mock.calls
    .map(([message]) => message)
    .filter(message => message.type === 'PENPOT_IMAGE');

describe('processImages', () => {
  let processImages: typeof ProcessImagesFn;
  let images: typeof ImagesMap;

  beforeEach(async () => {
    vi.resetModules();
    mockPostMessage.mockClear();

    // Import both from the same fresh module graph so processImages mutates the
    // very same `images` map instance we seed here.
    images = (await import('@plugin/libraries')).images;
    processImages = (await import('@plugin/processors/processImages')).processImages;

    images.clear();
  });

  it('streams one PENPOT_IMAGE per image and empties the map', async () => {
    images.set('hashA', createImage(new Uint8Array([1, 2, 3])));
    images.set('hashB', createImage(new Uint8Array([4, 5, 6])));

    await processImages(1);

    expect(images.size).toBe(0);
    expect(postedImageMessages()).toEqual([
      { type: 'PENPOT_IMAGE', data: { key: 'hashA', bytes: new Uint8Array([1, 2, 3]) } },
      { type: 'PENPOT_IMAGE', data: { key: 'hashB', bytes: new Uint8Array([4, 5, 6]) } }
    ]);
  });

  it('skips images whose bytes cannot be read without throwing', async () => {
    images.set('broken', {
      getBytesAsync: vi.fn().mockRejectedValue(new Error('no data'))
    } as unknown as Image);
    images.set('ok', createImage(new Uint8Array([7, 8])));

    await processImages(1);

    expect(images.size).toBe(0);
    expect(postedImageMessages()).toEqual([
      { type: 'PENPOT_IMAGE', data: { key: 'ok', bytes: new Uint8Array([7, 8]) } }
    ]);
  });

  it('does nothing when there are no images', async () => {
    await processImages(1);

    expect(postedImageMessages()).toHaveLength(0);
  });

  it('fetches image bytes concurrently instead of one at a time', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const release: Array<() => void> = [];

    const gatedImage = (bytes: Uint8Array): Image =>
      ({
        getBytesAsync: vi.fn().mockImplementation(() => {
          inFlight++;
          maxInFlight = Math.max(maxInFlight, inFlight);

          return new Promise<Uint8Array>(resolve => {
            release.push(() => {
              inFlight--;
              resolve(bytes);
            });
          });
        })
      }) as unknown as Image;

    images.set('a', gatedImage(new Uint8Array([1])));
    images.set('b', gatedImage(new Uint8Array([2])));
    images.set('c', gatedImage(new Uint8Array([3])));

    const done = processImages(1);

    expect(maxInFlight).toBeGreaterThan(1);

    release.forEach(resolve => resolve());
    await done;

    expect(images.size).toBe(0);
    expect(postedImageMessages()).toHaveLength(3);
  });
});
