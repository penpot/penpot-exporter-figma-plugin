import { LayoutChildAttributes } from '@ui/lib/types/layout/layoutChildAttributes';
import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';
import { ShapeBaseAttributes } from '@ui/lib/types/shape/shapeBaseAttributes';
import { ShapeGeomAttributes } from '@ui/lib/types/shape/shapeGeomAttributes';

import { CircleAttributes } from './circleAttributes';

export type CircleShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  CircleAttributes &
  LayoutChildAttributes;
