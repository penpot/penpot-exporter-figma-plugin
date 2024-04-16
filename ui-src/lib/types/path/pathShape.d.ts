import { LayoutChildAttributes } from '@ui/lib/types/layout/layoutChildAttributes';
import { PathAttributes } from '@ui/lib/types/path/pathAttributes';
import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';
import { ShapeBaseAttributes } from '@ui/lib/types/shape/shapeBaseAttributes';

export type PathShape = ShapeBaseAttributes &
  ShapeAttributes &
  PathAttributes &
  LayoutChildAttributes;
