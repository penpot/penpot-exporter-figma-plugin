import { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import { Children } from '@ui/lib/types/utils/children';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type GroupShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  GroupAttributes &
  Children &
  LayoutChildAttributes;

type GroupAttributes = {
  type?: 'group';
  shapes?: Uuid[];
};
