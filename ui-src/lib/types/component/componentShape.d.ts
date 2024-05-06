import { ShapeGeomAttributes } from '@ui/lib/types/shape/shapeGeomAttributes';
import { Children } from '@ui/lib/types/utils/children';

import { ComponentAttributes } from './componentAttributes';

export type ComponentShape = ShapeGeomAttributes & ComponentAttributes & Children;
