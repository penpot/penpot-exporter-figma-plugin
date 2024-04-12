import { PenpotFile } from '../lib/penpot';
import { CIRCLE_TYPE } from '../lib/types/circle/circleAttributes';
import { CircleShape } from '../lib/types/circle/circleShape';
import { translateFillGradients } from '../translators';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createPenpotCircle = (file: PenpotFile, { type, fills, ...rest }: CircleShape) => {
  file.createCircle({
    type: CIRCLE_TYPE,
    fills: translateFillGradients(fills),
    ...rest
  });
};
