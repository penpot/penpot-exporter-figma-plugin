import { yieldByTime } from '@common/sleep';

import { images } from '@plugin/libraries';
import { flushProgress, reportProgress } from '@plugin/utils';

export const processImages = async (): Promise<Record<string, Uint8Array<ArrayBuffer>>> => {
  const processedImages: Record<string, Uint8Array<ArrayBuffer>> = {};

  if (images.size === 0) return processedImages;

  let processedImagesCount = 0;

  reportProgress({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: images.size
  });

  reportProgress({
    type: 'PROGRESS_STEP',
    data: 'images'
  });

  for (const [key, image] of images.entries()) {
    const bytes = await image?.getBytesAsync();

    if (bytes) {
      processedImages[key] = bytes as Uint8Array<ArrayBuffer>;
    }

    processedImagesCount += 1;

    reportProgress({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: processedImagesCount
    });

    await yieldByTime();
  }

  flushProgress();

  return processedImages;
};
