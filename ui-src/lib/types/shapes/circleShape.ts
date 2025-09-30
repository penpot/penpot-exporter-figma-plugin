import type { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import type {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';

export type CircleShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  CircleAttributes &
  LayoutChildAttributes;

type CircleAttributes = {
  type?: 'circle';
};
