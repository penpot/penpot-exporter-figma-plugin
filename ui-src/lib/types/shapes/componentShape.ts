import { LayoutAttributes, LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import { Children } from '@ui/lib/types/utils/children';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type ComponentShape = ShapeBaseAttributes &
  ShapeAttributes &
  ShapeGeomAttributes &
  ComponentAttributes &
  LayoutAttributes &
  LayoutChildAttributes &
  Children;

export type ComponentAttributes = {
  type?: 'component';
  name: string;
  path: string;
  showContent?: boolean;
  mainInstanceId?: Uuid;
  mainInstancePage?: Uuid;
};
