import { Fill } from '@ui/lib/types/utils/fill';
import { ImageColor, PartialImageColor } from '@ui/lib/types/utils/imageColor';
import { uiImages } from '@ui/parser/libraries';
import { uiColorLibraries } from '@ui/parser/libraries/UiColorLibraries';

export const symbolFills = (fillStyleId?: string, fills?: Fill[]): Fill[] | undefined => {
  const fillStyle = fillStyleId ? uiColorLibraries.get(fillStyleId) : undefined;
  if (fillStyle) {
    return fillStyle.styles.map(style => {
      return style.fill;
    });
  }

  if (!fills) return;

  return fills.map(fill => {
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
