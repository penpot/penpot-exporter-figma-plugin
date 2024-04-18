import { LayoutChildAttributes } from '@ui/lib/types/layout/layoutChildAttributes';
import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';
import { ShapeBaseAttributes } from '@ui/lib/types/shape/shapeBaseAttributes';

import { BoolAttributes } from './boolAttributes';

export type BoolShape = ShapeBaseAttributes &
  ShapeAttributes &
  BoolAttributes &
  LayoutChildAttributes;
