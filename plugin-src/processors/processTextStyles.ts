import { yieldByTime } from '@common/sleep';

import { textStyles } from '@plugin/libraries';
import { translateTextStyle } from '@plugin/translators/styles';
import { flushProgress, reportProgress } from '@plugin/utils';

import type { TypographyStyle } from '@ui/lib/types/shapes/textShape';

const isTextStyle = (style: BaseStyle): style is TextStyle => {
  return style.type === 'TEXT';
};

export const registerTextStyles = async (): Promise<void> => {
  const localTextStyles = await figma.getLocalTextStylesAsync();
  localTextStyles.forEach(style => {
    textStyles.set(style.id, style);
  });
};

export const processTextStyles = async (): Promise<Record<string, TypographyStyle>> => {
  const styles: Record<string, TypographyStyle> = {};

  if (textStyles.size === 0) return styles;

  let currentStyle = 1;

  reportProgress({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: textStyles.size
  });

  reportProgress({
    type: 'PROGRESS_STEP',
    data: 'typographies'
  });

  for (const [styleId, style] of textStyles.entries()) {
    const figmaStyle = style ?? (await figma.getStyleByIdAsync(styleId));
    if (figmaStyle && isTextStyle(figmaStyle)) {
      styles[styleId] = translateTextStyle(figmaStyle);
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
