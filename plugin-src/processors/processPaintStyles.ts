import { paintStyles } from '@plugin/libraries';
import { translatePaintStyle } from '@plugin/translators/styles';
import { sleep } from '@plugin/utils';

import { FillStyle } from '@ui/lib/types/utils/fill';

const isPaintStyle = (style: BaseStyle): style is PaintStyle => {
  return style.type === 'PAINT';
};

export const registerPaintStyles = async () => {
  const localPaintStyles = await figma.getLocalPaintStylesAsync();
  localPaintStyles.forEach(style => {
    paintStyles.register(style.id, style);
  });
};

export const processPaintStyles = async (): Promise<Record<string, FillStyle>> => {
  const stylesToFetch = Object.entries(paintStyles.all());
  const styles: Record<string, FillStyle> = {};

  if (stylesToFetch.length === 0) return styles;

  let currentStyle = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: stylesToFetch.length
  });

  figma.ui.postMessage({
    type: 'PROGRESS_STEP',
    data: 'fills'
  });

  for (const [styleId, paintStyle] of stylesToFetch) {
    const figmaStyle = paintStyle ?? (await figma.getStyleByIdAsync(styleId));
    if (figmaStyle && isPaintStyle(figmaStyle)) {
      styles[styleId] = translatePaintStyle(figmaStyle);
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
