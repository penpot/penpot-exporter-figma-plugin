import type { LayoutAttributes, LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import type {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import type { VariantComponent, VariantProperty, VariantShape } from '@ui/lib/types/shapes/variant';
import type { Children } from '@ui/lib/types/utils/children';
import type { Uuid } from '@ui/lib/types/utils/uuid';

export type ComponentShape = ShapeBaseAttributes &
  ShapeAttributes &
  ShapeGeomAttributes &
  ComponentAttributes &
  LayoutAttributes &
  LayoutChildAttributes &
  VariantShape &
  VariantComponent &
  Children;

type ComponentAttributes = {
  type?: 'component';
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
  variantProperties?: VariantProperty[];
};
