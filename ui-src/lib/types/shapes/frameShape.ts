import { LayoutAttributes, LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import { ShapeBaseAttributes, ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';
import { Children } from '@ui/lib/types/utils/children';
import { Fill } from '@ui/lib/types/utils/fill';
import { Stroke } from '@ui/lib/types/utils/stroke';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type FrameShape = ShapeBaseAttributes &
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
  fills?: Fill[];
  strokes?: Stroke[];
};
