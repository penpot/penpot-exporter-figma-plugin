import { translateFill } from '@plugin/translators/fills/translateFills';

import { FillStyle } from '@ui/lib/types/utils/fill';

export const translatePaintStyle = (figmaStyle: PaintStyle): FillStyle => {
  const fillStyle: FillStyle = {
    name: figmaStyle.name,
    fills: [],
    colors: []
  };

  const colorName = (figmaStyle: PaintStyle, index: number): string => {
    return figmaStyle.paints.length > 1 ? `Color ${index + 1}` : figmaStyle.name;
  };

  let index = 0;
  const path =
    (figmaStyle.remote ? 'Remote / ' : '') + (figmaStyle.paints.length > 1 ? figmaStyle.name : '');

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
