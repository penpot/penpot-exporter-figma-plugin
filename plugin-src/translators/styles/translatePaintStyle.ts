import { translateFill } from '@plugin/translators/fills/translateFills';
import { translateStyleName, translateStylePath } from '@plugin/translators/styles';

import type { FillStyle } from '@ui/lib/types/utils/fill';

export const translatePaintStyle = (figmaStyle: PaintStyle): FillStyle => {
  const fillStyle: FillStyle = {
    name: figmaStyle.name,
    fills: [],
    colors: []
  };

  const colorName = (figmaStyle: PaintStyle, index: number): string => {
    return figmaStyle.paints.length > 1 ? `Color ${index + 1}` : translateStyleName(figmaStyle);
  };

  let index = 0;
  const path = translatePaintStylePath(figmaStyle);

  for (const fill of figmaStyle.paints) {
    const penpotFill = translateFill(fill);

    if (penpotFill) {
      fillStyle.fills.unshift(penpotFill);
      fillStyle.colors.unshift({
        path,
        name: colorName(figmaStyle, index)
      });
    }
    index++;
  }

  return fillStyle;
};

const translatePaintStylePath = (figmaStyle: PaintStyle): string => {
  const path = translateStylePath(figmaStyle);

  if (figmaStyle.paints.length <= 1) {
    return path;
  }

  return path + (path !== '' ? ' / ' : '') + translateStyleName(figmaStyle);
};
