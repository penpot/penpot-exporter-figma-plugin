import { yieldByTime } from '@common/sleep';

import { images } from '@plugin/libraries';
import { flushProgress, reportProgress } from '@plugin/utils';

export const processImages = async (
  currentAsset: number
): Promise<Record<string, Uint8Array<ArrayBuffer>>> => {
  // Images are streamed to the UI one by one (PENPOT_IMAGE messages) rather than
  // returned in bulk, so the document built downstream carries an empty record.
  const noImages: Record<string, Uint8Array<ArrayBuffer>> = {};

  if (images.size === 0) return noImages;

  let currentImage = currentAsset;

  for (const [key, image] of images.entries()) {
    try {
      const bytes = await image?.getBytesAsync();

      if (bytes) {
        // Stream each image to the UI immediately instead of accumulating its
        // bytes in memory, keeping the plugin-side peak at ~1 image at a time.
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
  }

  flushProgress();

  await yieldByTime(undefined, true);

  return noImages;
};
