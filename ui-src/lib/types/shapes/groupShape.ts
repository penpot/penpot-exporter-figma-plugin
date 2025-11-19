import type {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import type { Children } from '@ui/lib/types/utils/children';
import type { Uuid } from '@ui/lib/types/utils/uuid';

export type GroupShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  GroupAttributes &
  Children;

type GroupAttributes = {
  type?: 'group';
  shapes?: Uuid[];
};
