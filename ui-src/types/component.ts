import { LayoutAttributes, LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import { ShapeAttributes, ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';
import { Children } from '@ui/lib/types/utils/children';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type ComponentRoot = {
  figmaId: string;
  type: 'component';
  name: string;
};

export type ComponentTextPropertyOverride = {
  id: string;
  type: 'TEXT';
  value: string;
  defaultValue: string;
};

export type ComponentInstance = ShapeGeomAttributes &
  ShapeAttributes &
  LayoutAttributes &
  LayoutChildAttributes &
  Children & {
    mainComponentFigmaId: string;
    figmaId?: string;
    figmaRelatedId?: string;
    isComponentRoot: boolean;
    showContent?: boolean;
    isOrphan: boolean;
    type: 'instance';
  };

export type UiComponent = {
  componentId: Uuid;
  mainInstancePage?: Uuid;
  mainInstanceId: Uuid;
  componentFigmaId: string;
};
