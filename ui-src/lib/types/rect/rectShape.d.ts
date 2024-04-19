import { LayoutChildAttributes } from '@ui/lib/types/layout/layoutChildAttributes';
import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';
import { ShapeBaseAttributes } from '@ui/lib/types/shape/shapeBaseAttributes';
import { ShapeGeomAttributes } from '@ui/lib/types/shape/shapeGeomAttributes';

import { RectAttributes } from './rectAttributes';

export type RectShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  RectAttributes &
  LayoutChildAttributes;
