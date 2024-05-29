import { ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';
import { Children } from '@ui/lib/types/utils/children';

export type ComponentRoot = {
  figmaId: string;
  type: 'component';
};

export type ComponentInstance = ShapeGeomAttributes &
  Children & {
    figmaId: string;
    type: 'instance';
  };
