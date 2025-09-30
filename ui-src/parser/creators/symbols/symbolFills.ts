import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { Fill } from '@ui/lib/types/utils/fill';
import type { ImageColor, PartialImageColor } from '@ui/lib/types/utils/imageColor';
import { colors, images } from '@ui/parser';

export const symbolFills = (
  context: PenpotContext,
  fillStyleId?: string,
  fills?: Fill[]
): Fill[] | undefined => {
  const nodeFills = fillStyleId ? colors.get(fillStyleId)?.fills : fills;

  if (!nodeFills) return;

  return nodeFills.map(fill => {
    if (fill.fillImage) {
      fill.fillImage = symbolFillImage(context, fill.fillImage);
    }

    return fill;
  });
};

export const symbolFillImage = (
  context: PenpotContext,
  fillImage: ImageColor | PartialImageColor
): ImageColor | undefined => {
  if (!isPartialFillColor(fillImage)) return fillImage;
  const mediaId = images.get(fillImage.imageHash);
  if (!mediaId) return;

  return {
    ...context.getMediaAsImage(mediaId),
    keepAspectRatio: true
  };
};

const isPartialFillColor = (
  imageColor: ImageColor | PartialImageColor
): imageColor is PartialImageColor => {
  return 'imageHash' in imageColor;
};
