import type { BlendMode } from '@ui/lib/types/utils/blendModes';
import type { Blur } from '@ui/lib/types/utils/blur';
import type { Export } from '@ui/lib/types/utils/export';
import type { Fill } from '@ui/lib/types/utils/fill';
import type { Grid } from '@ui/lib/types/utils/grid';
import type { Interaction } from '@ui/lib/types/utils/interaction';
import type { Matrix } from '@ui/lib/types/utils/matrix';
import type { Point } from '@ui/lib/types/utils/point';
import type { Selrect } from '@ui/lib/types/utils/selrect';
import type { Shadow } from '@ui/lib/types/utils/shadow';
import type { Stroke } from '@ui/lib/types/utils/stroke';
import type { SyncGroups } from '@ui/lib/types/utils/syncGroups';
import type { Uuid } from '@ui/lib/types/utils/uuid';
import type { ComponentPropertyReference } from '@ui/types';

export type ShapeBaseAttributes = {
  id?: Uuid;
  name: string;
  type?:
    | 'frame'
    | 'group'
    | 'bool'
    | 'rect'
    | 'path'
    | 'text'
    | 'circle'
    | 'svg-raw'
    | 'image'
    | 'component'
    | 'instance';
  selrect?: Selrect;
  points?: Point[];
  transform?: Matrix;
  transformInverse?: Matrix;
  parentId?: Uuid;
  frameId?: Uuid;
  rotation?: number;

  figmaId?: string; // @TODO: move to any other place
  figmaRelatedId?: string; // @TODO: move to any other place
};

export type ShapeAttributes = {
  pageId?: Uuid;
  componentId?: Uuid;
  componentFile?: Uuid;
  componentRoot?: boolean;
  mainInstance?: boolean;
  remoteSynced?: boolean;
  shapeRef?: Uuid;
  touched?: SyncGroups[];
  blocked?: boolean;
  collapsed?: boolean;
  locked?: boolean;
  hidden?: boolean;
  maskedGroup?: boolean;
  fills?: Fill[];
  proportion?: number;
  proportionLock?: boolean;
  constraintsH?: ConstraintH;
  constraintsV?: ConstraintV;
  fixedScroll?: boolean;
  r1?: number;
  r2?: number;
  r3?: number;
  r4?: number;
  opacity?: number;
  grids?: Grid[];
  exports?: Export[];
  strokes?: Stroke[];
  blendMode?: BlendMode;
  interactions?: Interaction[];
  shadow?: Shadow[];
  blur?: Blur;
  growType?: GrowType;

  fillStyleId?: string; // @TODO: move to any other place
  componentPropertyReferences?: ComponentPropertyReference; // @TODO: move to any other place
};

export type ShapeGeomAttributes = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GrowType = 'auto-width' | 'auto-height' | 'fixed';

export type ConstraintH = 'left' | 'right' | 'leftright' | 'center' | 'scale';
export type ConstraintV = 'top' | 'bottom' | 'topbottom' | 'center' | 'scale';
