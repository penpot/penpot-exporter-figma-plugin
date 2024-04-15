import { PenpotFile } from '@ui/lib/penpot';
import { RECT_TYPE } from '@ui/lib/types/rect/rectAttributes';
import { RectShape } from '@ui/lib/types/rect/rectShape';
import { translateFillGradients } from '@ui/translators';

export const createPenpotRectangle = (file: PenpotFile, { type, fills, ...rest }: RectShape) => {
  file.createRect({
    type: RECT_TYPE,
    fills: translateFillGradients(fills),
    ...rest
  });
};
