import { fromByteArray } from 'base64-js';

import { imagesLibrary } from '@plugin/ImageLibrary';
import { detectMimeType } from '@plugin/utils';

import { Fill } from '@ui/lib/types/utils/fill';
import { Gradient, LINEAR_TYPE, RADIAL_TYPE } from '@ui/lib/types/utils/gradient';
import { ImageColor } from '@ui/lib/types/utils/imageColor';

export const symbolFills = (fills?: Fill[]): Fill[] | undefined => {
  if (!fills) return;

  return fills.map(fill => {
    if (fill.fillColorGradient) {
      fill.fillColorGradient = symbolFillGradient(fill.fillColorGradient);
    }

    if (fill.fillImage) {
      fill.fillImage = symbolFillImage(fill.fillImage);
    }

    return fill;
  });
};

const symbolFillGradient = (fillGradient: Gradient): Gradient => {
  if (typeof fillGradient.type !== 'string') return fillGradient;

  const { type, ...rest } = fillGradient;

  switch (type) {
    case 'linear':
      return {
        type: LINEAR_TYPE,
        ...rest
      };
    case 'radial':
      return {
        type: RADIAL_TYPE,
        ...rest
      };
  }
};

const symbolFillImage = (fillImage: ImageColor): ImageColor | undefined => {
  if (fillImage.dataUri) return fillImage;

  const { imageHash, bytes, ...rest } = fillImage;

  if (!imageHash) return;

  const imageColor = imagesLibrary.get(imageHash);

  if (!imageColor || !imageColor.bytes) return;

  const b64 = fromByteArray(imageColor.bytes);
  const mtype = detectMimeType(b64);

  return {
    ...rest,
    mtype,
    dataUri: `data:${mtype};base64,${b64}`
  };
};
