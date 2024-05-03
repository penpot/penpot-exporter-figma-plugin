import { Matrix } from '@ui/lib/types/utils/matrix';
import { Point } from '@ui/lib/types/utils/point';
import { Selrect } from '@ui/lib/types/utils/selrect';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type ShapeBaseAttributes = {
  id?: Uuid;
  name?: string;
  type?: 'frame' | 'group' | 'bool' | 'rect' | 'path' | 'text' | 'circle' | 'svg-raw' | 'image';
  selrect?: Selrect;
  points?: Point[];
  transform?: Matrix;
  transformInverse?: Matrix;
  parentId?: Uuid;
  frameId?: Uuid;
  rotation?: number;
};
