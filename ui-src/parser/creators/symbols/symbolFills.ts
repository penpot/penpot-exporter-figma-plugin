import { styleLibrary } from '@plugin/StyleLibrary';

import { Fill } from '@ui/lib/types/utils/fill';
import { ImageColor, PartialImageColor } from '@ui/lib/types/utils/imageColor';
import { uiImages } from '@ui/parser/libraries';

export const symbolFills = (fillStyleId?: string, fills?: Fill[]): Fill[] | undefined => {
  const nodeFills = fillStyleId ? styleLibrary.get(fillStyleId) : fills;

  if (!nodeFills) return;

  return nodeFills.map(fill => {
    if (fill.fillImage) {
      fill.fillImage = symbolFillImage(fill.fillImage);
    }

    return fill;
  });
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
