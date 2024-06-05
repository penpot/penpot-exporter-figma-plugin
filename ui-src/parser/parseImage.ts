import { ImageColor } from '@ui/lib/types/utils/imageColor';
import { detectMimeType } from '@ui/utils';

const IMAGE_QUALITY = 0.8;

export const parseImage = async (bytes: Uint8Array): Promise<ImageColor> => {
  const image = await extractFromBytes(bytes);

  return {
    width: image.width,
    height: image.height,
    dataUri: image.dataURL,
    keepAspectRatio: true,
    id: '00000000-0000-0000-0000-000000000000'
  };
};

async function extractFromBytes(bytes: Uint8Array) {
  const mymeType = detectMimeType(bytes);
  const url = URL.createObjectURL(new Blob([bytes]));

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

  const dataURL = await canvas
    .convertToBlob({ type: mymeType, quality: IMAGE_QUALITY })
    .then(blob => {
      return new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    });

  return {
    dataURL,
    width: image.width,
    height: image.height
  };
}
