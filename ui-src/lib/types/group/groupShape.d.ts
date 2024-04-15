import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';
import { ShapeBaseAttributes } from '@ui/lib/types/shape/shapeBaseAttributes';
import { ShapeGeomAttributes } from '@ui/lib/types/shape/shapeGeomAttributes';
import { Children } from '@ui/lib/types/utils/children';

import { GroupAttributes } from './groupAttributes';

export type GroupShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  GroupAttributes &
  Children;
