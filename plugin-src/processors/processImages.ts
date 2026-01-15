import { yieldByTime } from '@common/sleep';

import { images } from '@plugin/libraries';
import { flushProgress, reportProgress } from '@plugin/utils';

export const processImages = async (
  currentAsset: number
): Promise<Record<string, Uint8Array<ArrayBuffer>>> => {
  const processedImages: Record<string, Uint8Array<ArrayBuffer>> = {};

  if (images.size === 0) return processedImages;

  let currentImage = currentAsset;

  for (const [key, image] of images.entries()) {
    try {
      const bytes = await image?.getBytesAsync();

      if (bytes) {
        processedImages[key] = bytes as Uint8Array<ArrayBuffer>;
      }
    } catch {
      // Skip images without valid data (e.g., empty image fills)
    }

    reportProgress({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentImage++
    });

    await yieldByTime();
  }

  flushProgress();

  await yieldByTime(undefined, true);

  return processedImages;
};
