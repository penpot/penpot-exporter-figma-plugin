import type { LayoutAttributes, LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import type {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import type { Children } from '@ui/lib/types/utils/children';
import type { Uuid } from '@ui/lib/types/utils/uuid';

export type VariantProperty = {
  name: string;
  value: string;
};

export type VariantAttributes = {
  variantId?: Uuid;
  variantName?: string;
  variantProperties?: VariantProperty[];
};

export type ComponentShape = ShapeBaseAttributes &
  ShapeAttributes &
  ShapeGeomAttributes &
  ComponentAttributes &
  LayoutAttributes &
  LayoutChildAttributes &
  Children &
  VariantAttributes;

export type ComponentAttributes = {
  type?: 'component';
  name: string;
  path: string;
  showContent?: boolean;
  mainInstanceId?: Uuid;
  mainInstancePage?: Uuid;
};

export type PenpotComponent = {
  componentId: Uuid;
  fileId?: Uuid;
  name?: string;
  path?: string;
  frameId?: Uuid;
  pageId?: Uuid;
  variantId?: Uuid;
};
