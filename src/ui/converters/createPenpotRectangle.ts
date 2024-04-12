import { PenpotFile } from '../lib/penpot';
import { RECT_TYPE } from '../lib/types/rect/rectAttributes';
import { RectShape } from '../lib/types/rect/rectShape';
import { translateFillGradients } from '../translators';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createPenpotRectangle = (file: PenpotFile, { type, fills, ...rest }: RectShape) => {
  file.createRect({
    type: RECT_TYPE,
    fills: translateFillGradients(fills),
    ...rest
  });
};
