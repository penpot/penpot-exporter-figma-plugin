import { asyncPool } from '@common/asyncPool';
import { yieldByTime } from '@common/sleep';

import { images } from '@plugin/libraries';
import { flushProgress, reportProgress } from '@plugin/utils';

// `getBytesAsync` is a round-trip to the Figma host, so fetching images is
// latency-bound. A small pool keeps a few requests in flight at once instead of
// waiting for each one sequentially.
const POOL_SIZE = 3;

// Images are streamed to the UI one by one (PENPOT_IMAGE messages) instead of
// being returned in bulk, so they never get accumulated plugin-side.
export const processImages = async (currentAsset: number): Promise<void> => {
  if (images.size === 0) return;

  let currentImage = currentAsset;

  await asyncPool(POOL_SIZE, images, async ([key, image]) => {
    try {
      const bytes = await image?.getBytesAsync();

      if (bytes) {
        // Stream each image to the UI immediately instead of accumulating its
        // bytes in memory, keeping the plugin-side peak at ~POOL_SIZE images.
        reportProgress({
          type: 'PENPOT_IMAGE',
          data: { key, bytes: bytes as Uint8Array<ArrayBuffer> }
        });
      }
    } catch {
      // Skip images without valid data (e.g., empty image fills)
    }

    // Remove processed image from map to free memory
    images.delete(key);

    reportProgress({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentImage++
    });

    await yieldByTime();
  });

  flushProgress();

  await yieldByTime(undefined, true);
};
