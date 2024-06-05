import { imagesLibrary } from '@plugin/ImageLibrary';

import { Fill } from '@ui/lib/types/utils/fill';
import { PartialImageColor } from '@ui/lib/types/utils/imageColor';

export const translateImageFill = (fill: ImagePaint): Fill | undefined => {
  const fillImage = translateImage(fill.imageHash);
  if (!fillImage) return;

  return {
    fillOpacity: !fill.visible ? 0 : fill.opacity,
    fillImage
  };
};

const translateImage = (imageHash: string | null): PartialImageColor | undefined => {
  if (!imageHash) return;

  if (imagesLibrary.get(imageHash) === undefined) {
    imagesLibrary.register(imageHash, figma.getImageByHash(imageHash));
  }

  return {
    imageHash
  };
};
