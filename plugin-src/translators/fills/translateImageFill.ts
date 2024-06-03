import { imagesLibrary } from '@plugin/ImageLibrary';

import { Fill } from '@ui/lib/types/utils/fill';
import { ImageColor } from '@ui/lib/types/utils/imageColor';

export const translateImageFill = async (fill: ImagePaint): Promise<Fill | undefined> => {
  const fillImage = await translateImage(fill.imageHash);
  if (!fillImage) return;

  return {
    fillOpacity: !fill.visible ? 0 : fill.opacity,
    fillImage
  };
};

const translateImage = async (imageHash: string | null): Promise<ImageColor | undefined> => {
  if (!imageHash) return;

  const imageColor = imagesLibrary.get(imageHash) ?? (await generateAndRegister(imageHash));

  if (!imageColor) return;

  const { dataUri, ...rest } = imageColor;

  return {
    ...rest,
    imageHash
  };
};

const generateAndRegister = async (imageHash: string) => {
  const image = figma.getImageByHash(imageHash);

  if (!image) return;

  const bytes = await image.getBytesAsync();
  const { width, height } = await image.getSizeAsync();

  const imageColor: ImageColor = {
    width,
    height,
    bytes,
    keepAspectRatio: true,
    id: '00000000-0000-0000-0000-000000000000'
  };

  imagesLibrary.register(imageHash, imageColor);

  return imageColor;
};
