import { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';

export type RectShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  RectAttributes &
  LayoutChildAttributes;

type RectAttributes = {
  type?: 'rect';
};
