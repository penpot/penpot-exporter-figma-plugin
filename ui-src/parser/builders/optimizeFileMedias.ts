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
  const url = URL.createObjectURL(new Blob([bytes]));

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = (): void => resolve(img);
      img.onerror = (): void => reject();
      img.src = url;
    });

    const canvas = new OffscreenCanvas(image.width, image.height);
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not create canvas context');
    }

    context.drawImage(image, 0, 0);

    const blob = await canvas.convertToBlob({ type: IMAGE_FORMAT, quality: IMAGE_QUALITY });

    return {
      blob,
      width: image.width,
      height: image.height
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
