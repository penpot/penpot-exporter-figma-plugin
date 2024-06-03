import { imagesLibrary } from '@plugin/ImageLibrary';

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

const symbolFillGradient = ({ type, ...rest }: Gradient): Gradient | undefined => {
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

  console.error(`Unsupported gradient type: ${String(type)}`);
};

const symbolFillImage = ({ imageHash, ...rest }: ImageColor): ImageColor | undefined => {
  if (!imageHash) return;

  const imageColor = imagesLibrary.get(imageHash);

  if (!imageColor) return;

  return {
    ...rest,
    dataUri: imageColor?.dataUri
  };
};
