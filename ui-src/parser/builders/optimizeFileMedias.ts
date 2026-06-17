import { yieldByTime } from '@common/sleep';

import { flushMessageQueue, sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { Uuid } from '@ui/lib/types/utils/uuid';
import { images } from '@ui/parser';

const IMAGE_FORMAT = 'image/webp';
const IMAGE_QUALITY = 0.8;

export const optimizeFileMedias = async (
  context: PenpotContext,
  imagesToOptimize: [string, Uint8Array<ArrayBuffer>][],
  currentAsset: number
): Promise<void> => {
  if (imagesToOptimize.length === 0) return;

  let imagesOptimized = currentAsset;

  for (const [key, bytes] of imagesToOptimize) {
    if (bytes) {
      images.set(key, await registerFileMedia(context, key, bytes));
    }

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: imagesOptimized++
    });

    await yieldByTime();
  }

  flushMessageQueue();

  await yieldByTime(undefined, true);
};

const registerFileMedia = async (
  context: PenpotContext,
  key: string,
  bytes: Uint8Array<ArrayBuffer>
): Promise<Uuid> => {
  const image = await optimizeImage(bytes);

  return context.addFileMedia(
    {
      name: key,
      width: image.width,
      height: image.height
    },
    image.blob
  );
};

async function optimizeImage(bytes: Uint8Array<ArrayBuffer>): Promise<{
  blob: Blob;
  width: number;
  height: number;
}> {
  // createImageBitmap decodes straight from the bytes (no object URL / <img>
  // intermediaries), and bitmap.close() lets us free the decoded pixels
  // deterministically instead of waiting for the GC to collect a detached image.
  const bitmap = await createImageBitmap(new Blob([bytes]));

  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not create canvas context');
    }

    context.drawImage(bitmap, 0, 0);

    const blob = await canvas.convertToBlob({ type: IMAGE_FORMAT, quality: IMAGE_QUALITY });

    return {
      blob,
      width: bitmap.width,
      height: bitmap.height
    };
  } finally {
    bitmap.close();
  }
}
