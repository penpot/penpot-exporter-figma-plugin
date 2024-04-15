import { Matrix } from '@ui/lib/types/utils/matrix';
import { Point } from '@ui/lib/types/utils/point';
import { Selrect } from '@ui/lib/types/utils/selrect';
import { Uuid } from '@ui/lib/types/utils/uuid';

export const FRAME_TYPE: unique symbol = Symbol.for('frame');
export const GROUP_TYPE: unique symbol = Symbol.for('group');
export const BOOL_TYPE: unique symbol = Symbol.for('bool');
export const RECT_TYPE: unique symbol = Symbol.for('rect');
export const PATH_TYPE: unique symbol = Symbol.for('path');
export const TEXT_TYPE: unique symbol = Symbol.for('text');
export const CIRCLE_TYPE: unique symbol = Symbol.for('circle');
export const SVG_RAW_TYPE: unique symbol = Symbol.for('svg-raw');
export const IMAGE_TYPE: unique symbol = Symbol.for('image');

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
};
