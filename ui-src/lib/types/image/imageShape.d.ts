import { LayoutChildAttributes } from '@ui/lib/types/layout/layoutChildAttributes';
import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';
import { ShapeBaseAttributes } from '@ui/lib/types/shape/shapeBaseAttributes';
import { ShapeGeomAttributes } from '@ui/lib/types/shape/shapeGeomAttributes';

import { ImageAttributes } from './imageAttributes';

export type ImageShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  ImageAttributes &
  LayoutChildAttributes;
