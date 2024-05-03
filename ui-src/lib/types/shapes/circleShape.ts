import { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import {
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
