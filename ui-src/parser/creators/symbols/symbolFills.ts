import { Fill } from '@ui/lib/types/utils/fill';
import { Gradient, LINEAR_TYPE, RADIAL_TYPE } from '@ui/lib/types/utils/gradient';
import { ImageColor, PartialImageColor } from '@ui/lib/types/utils/imageColor';
import { uiImages } from '@ui/parser/libraries';

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

export const symbolFillImage = (
  fillImage: ImageColor | PartialImageColor
): ImageColor | undefined => {
  if (!isPartialFillColor(fillImage)) return fillImage;

  return uiImages.get(fillImage.imageHash);
};

const isPartialFillColor = (
  imageColor: ImageColor | PartialImageColor
): imageColor is PartialImageColor => {
  return 'imageHash' in imageColor;
};
