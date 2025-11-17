import { yieldByTime } from '@common/sleep';

import { images, paintStyles, textStyles } from '@plugin/libraries';
import { processImages, processPaintStyles, processTextStyles } from '@plugin/processors';
import { reportProgress } from '@plugin/utils';

import type { TypographyStyle } from '@ui/lib/types/shapes/textShape';
import type { FillStyle } from '@ui/lib/types/utils/fill';

export const processAssets = async (): Promise<
  [
    Record<string, Uint8Array<ArrayBuffer>>,
    Record<string, FillStyle>,
    Record<string, TypographyStyle>
  ]
> => {
  const total = images.size + paintStyles.size + textStyles.size;

  reportProgress({
    type: 'PROGRESS_STEP',
    data: {
      step: 'processAssets',
      total
    }
  });

  await yieldByTime(undefined, true);

  const processedPaintStyles = await processPaintStyles(1);
  const processedTextStyles = await processTextStyles(paintStyles.size + 1);
  const processedImages = await processImages(paintStyles.size + textStyles.size + 1);

  return [processedImages, processedPaintStyles, processedTextStyles];
};
