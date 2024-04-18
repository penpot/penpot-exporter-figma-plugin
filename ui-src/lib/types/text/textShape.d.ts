import { LayoutChildAttributes } from '@ui/lib/types/layout/layoutChildAttributes';
import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';
import { ShapeBaseAttributes } from '@ui/lib/types/shape/shapeBaseAttributes';
import { ShapeGeomAttributes } from '@ui/lib/types/shape/shapeGeomAttributes';

import { TextAttributes } from './textAttributes';

export type TextShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  TextAttributes &
  LayoutChildAttributes;
