import { PenpotContext } from '@ui/lib/types/penpotContext';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { detectMimeType } from '@ui/utils';

const IMAGE_QUALITY = 0.8;

export const parseImage = async (
  context: PenpotContext,
  key: string,
  bytes: Uint8Array
): Promise<Uuid> => {
  const image = await extractFromBytes(bytes);

  return context.addFileMedia(
    {
      name: key,
      width: image.width,
      height: image.height
    },
    image.blob
  );
};

async function extractFromBytes(bytes: Uint8Array) {
  const mimeType = detectMimeType(bytes);
  const url = URL.createObjectURL(new Blob([bytes]));

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject();
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
