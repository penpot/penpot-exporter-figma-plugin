import { PATH_TYPE } from '@ui/lib/types/path/pathAttributes';
import { Matrix } from '@ui/lib/types/utils/matrix';
import { Point } from '@ui/lib/types/utils/point';
import { Selrect } from '@ui/lib/types/utils/selrect';
import { Uuid } from '@ui/lib/types/utils/uuid';

import { BOOL_TYPE } from '../bool/boolAttributes';
import { CIRCLE_TYPE } from '../circle/circleAttributes';
import { FRAME_TYPE } from '../frame/frameAttributes';
import { GROUP_TYPE } from '../group/groupAttributes';
import { IMAGE_TYPE } from '../image/imageAttributes';
import { RECT_TYPE } from '../rect/rectAttributes';
import { TEXT_TYPE } from '../text/textAttributes';

// @TODO: Move to its own file once we support all the shapes
export const SVG_RAW_TYPE: unique symbol = Symbol.for('svg-raw');

export type ShapeBaseAttributes = {
  id?: Uuid;
  name?: string;
  type:
    | 'frame'
    | 'group'
    | 'bool'
    | 'rect'
    | 'path'
    | 'text'
    | 'circle'
    | 'svg-raw'
    | 'image'
    | typeof FRAME_TYPE
    | typeof GROUP_TYPE
    | typeof BOOL_TYPE
    | typeof RECT_TYPE
    | typeof PATH_TYPE
    | typeof TEXT_TYPE
    | typeof CIRCLE_TYPE
    | typeof SVG_RAW_TYPE
    | typeof IMAGE_TYPE;
  selrect?: Selrect;
  points?: Point[];
  transform?: Matrix;
  transformInverse?: Matrix;
  parentId?: Uuid;
  frameId?: Uuid;
  rotation?: number;
};
