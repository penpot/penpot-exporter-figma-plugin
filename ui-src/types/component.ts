import { LayoutAttributes, LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import { ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';
import { Children } from '@ui/lib/types/utils/children';

export type ComponentRoot = {
  figmaId: string;
  type: 'component';
};

export type ComponentInstance = ShapeGeomAttributes &
  LayoutAttributes &
  LayoutChildAttributes &
  Children & {
    mainComponentFigmaId: string;
    figmaId?: string;
    figmaRelatedId?: string;
    isComponentRoot: boolean;
    type: 'instance';
  };
