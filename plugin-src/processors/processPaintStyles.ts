import { yieldByTime } from '@common/sleep';

import { degradedLayers, paintStyles } from '@plugin/libraries';
import { translatePaintStyle } from '@plugin/translators/styles';
import { flushProgress, isFigmaPlatformFailure, reportProgress } from '@plugin/utils';

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

export const processPaintStyles = async (
  currentAsset: number
): Promise<Record<string, FillStyle>> => {
  const styles: Record<string, FillStyle> = {};

  if (paintStyles.size === 0) return styles;

  let currentStyle = currentAsset;

  for (const [styleId, paintStyle] of paintStyles.entries()) {
    try {
      const figmaStyle = paintStyle ?? (await figma.getStyleByIdAsync(styleId));
      if (figmaStyle && isPaintStyle(figmaStyle)) {
        styles[styleId] = translatePaintStyle(figmaStyle);
      }
    } catch (error) {
      if (!isFigmaPlatformFailure(error)) throw error;

      const styleName = paintStyle?.name ?? styleId;
      console.warn(`Penpot Exporter: skipped style "${styleName}" due to a Figma platform error`);
      degradedLayers.set(styleId, `${styleName}: style skipped due to a Figma platform error`);

      continue;
    }

    reportProgress({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentStyle++
    });

    await yieldByTime();
  }

  flushProgress();

  await yieldByTime(undefined, true);

  return styles;
};
