import { ShapeBaseAttributes } from '@ui/lib/types/shape/shapeBaseAttributes';
import { ShapeGeomAttributes } from '@ui/lib/types/shape/shapeGeomAttributes';
import { Children } from '@ui/lib/types/utils/children';

import { FrameAttributes } from './frameAttributes';

export type FrameShape = ShapeBaseAttributes & ShapeGeomAttributes & FrameAttributes & Children;
