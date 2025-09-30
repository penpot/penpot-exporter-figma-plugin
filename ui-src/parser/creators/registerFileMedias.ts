import { sleep } from '@common/sleep';

import { sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { Uuid } from '@ui/lib/types/utils/uuid';
import { images } from '@ui/parser';
import { detectMimeType } from '@ui/utils';

const IMAGE_QUALITY = 0.8;

export const registerFileMedias = async (
  context: PenpotContext,
  binaryImages: Record<string, Uint8Array<ArrayBuffer>>
): Promise<void> => {
  const imagesToOptimize = Object.entries(binaryImages);

  if (imagesToOptimize.length === 0) return;

  let imagesOptimized = 1;

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: imagesToOptimize.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'optimization'
  });

  for (const [key, bytes] of imagesToOptimize) {
    if (bytes) {
      images.set(key, await registerFileMedia(context, key, bytes));
    }

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: imagesOptimized++
    });

    await sleep(0);
  }
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
  const mimeType = detectMimeType(bytes);
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

    const blob = await canvas.convertToBlob({ type: mimeType, quality: IMAGE_QUALITY });

    return {
      blob,
      width: image.width,
      height: image.height
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
