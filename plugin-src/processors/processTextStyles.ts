import { toArray } from '@common/map';
import { sleep } from '@common/sleep';

import { textStyles } from '@plugin/libraries';
import { translateTextStyle } from '@plugin/translators/styles';

import { TypographyStyle } from '@ui/lib/types/shapes/textShape';

const isTextStyle = (style: BaseStyle): style is TextStyle => {
  return style.type === 'TEXT';
};

export const registerTextStyles = async () => {
  const localTextStyles = await figma.getLocalTextStylesAsync();
  localTextStyles.forEach(style => {
    textStyles.set(style.id, style);
  });
};

export const processTextStyles = async (): Promise<Record<string, TypographyStyle>> => {
  const stylesToFetch = toArray(textStyles);
  const styles: Record<string, TypographyStyle> = {};

  if (stylesToFetch.length === 0) return styles;

  let currentStyle = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: stylesToFetch.length
  });

  figma.ui.postMessage({
    type: 'PROGRESS_STEP',
    data: 'typographies'
  });

  for (const [styleId, style] of stylesToFetch) {
    const figmaStyle = style ?? (await figma.getStyleByIdAsync(styleId));
    if (figmaStyle && isTextStyle(figmaStyle)) {
      styles[styleId] = translateTextStyle(figmaStyle);
    }

    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentStyle++
    });

    await sleep(0);
  }

  await sleep(20);

  return styles;
};
