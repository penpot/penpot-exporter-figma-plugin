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

  const result: Fill[] = [];

  for (const fill of nodeFills) {
    if (fill.fillImage) {
      const resolvedImage = symbolFillImage(context, fill.fillImage);

      // Skip fills with invalid/missing images
      if (!resolvedImage) continue;

      fill.fillImage = resolvedImage;
    }

    result.push(fill);
  }

  return result;
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
