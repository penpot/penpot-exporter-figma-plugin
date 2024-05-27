import { LayoutAttributes, LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import { Children } from '@ui/lib/types/utils/children';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type FrameShape = ShapeBaseAttributes &
  ShapeAttributes &
  ShapeGeomAttributes &
  FrameAttributes &
  LayoutAttributes &
  LayoutChildAttributes &
  Children;

type FrameAttributes = {
  type?: 'frame';
  shapes?: Uuid[];
  hideFillOnExport?: boolean;
  showContent?: boolean;
  hideInViewer?: boolean;
};
