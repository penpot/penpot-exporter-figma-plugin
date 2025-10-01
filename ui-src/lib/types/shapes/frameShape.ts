import type { LayoutAttributes, LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import type {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import type { Children } from '@ui/lib/types/utils/children';
import type { Uuid } from '@ui/lib/types/utils/uuid';

export type FrameShape = ShapeBaseAttributes &
  ShapeAttributes &
  ShapeGeomAttributes &
  FrameAttributes &
  LayoutAttributes &
  LayoutChildAttributes &
  Children & {
    isVariantContainer?: boolean;
  };

type FrameAttributes = {
  type?: 'frame';
  shapes?: Uuid[];
  hideFillOnExport?: boolean;
  showContent?: boolean;
  hideInViewer?: boolean;
};
