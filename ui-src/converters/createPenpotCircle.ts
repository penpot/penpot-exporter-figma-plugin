import { PenpotFile } from '@ui/lib/penpot';
import { CIRCLE_TYPE } from '@ui/lib/types/circle/circleAttributes';
import { CircleShape } from '@ui/lib/types/circle/circleShape';

import { translateFillGradients } from '../translators';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createPenpotCircle = (file: PenpotFile, { type, fills, ...rest }: CircleShape) => {
  file.createCircle({
    type: CIRCLE_TYPE,
    fills: translateFillGradients(fills),
    ...rest
  });
};
