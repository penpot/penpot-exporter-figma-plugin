import { yieldByTime } from '@common/sleep';

import { paintStyles } from '@plugin/libraries';
import { translatePaintStyle } from '@plugin/translators/styles';
import { flushProgress, reportProgress } from '@plugin/utils';

import type { FillStyle } from '@ui/lib/types/utils/fill';

const isPaintStyle = (style: BaseStyle): style is PaintStyle => {
  return style.type === 'PAINT';
};

export const registerPaintStyles = async (): Promise<void> => {
  const localPaintStyles = await figma.getLocalPaintStylesAsync();
  localPaintStyles.forEach(style => {
    paintStyles.set(style.id, style);
  });
};

export const processPaintStyles = async (): Promise<Record<string, FillStyle>> => {
  const styles: Record<string, FillStyle> = {};

  if (paintStyles.size === 0) return styles;

  let currentStyle = 1;

  reportProgress({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: paintStyles.size
  });

  reportProgress({
    type: 'PROGRESS_STEP',
    data: 'fills'
  });

  for (const [styleId, paintStyle] of paintStyles.entries()) {
    const figmaStyle = paintStyle ?? (await figma.getStyleByIdAsync(styleId));
    if (figmaStyle && isPaintStyle(figmaStyle)) {
      styles[styleId] = translatePaintStyle(figmaStyle);
    }

    reportProgress({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentStyle++
    });

    await yieldByTime();
  }

  flushProgress();

  return styles;
};
