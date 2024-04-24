import { BlendMode } from '@ui/lib/types/utils/blendModes';
import { Blur } from '@ui/lib/types/utils/blur';
import { Export } from '@ui/lib/types/utils/export';
import { Fill } from '@ui/lib/types/utils/fill';
import { Grid } from '@ui/lib/types/utils/grid';
import { Interaction } from '@ui/lib/types/utils/interaction';
import { Point } from '@ui/lib/types/utils/point';
import { Selrect } from '@ui/lib/types/utils/selrect';
import { Shadow } from '@ui/lib/types/utils/shadow';
import { Stroke } from '@ui/lib/types/utils/stroke';

export type ShapeAttributes = {
  name?: string;
  componentId?: string;
  componentFile?: string;
  componentRoot?: boolean;
  mainInstance?: boolean;
  remoteSynced?: boolean;
  shapeRef?: string;
  selrect?: Selrect;
  points?: Point[];
  blocked?: boolean;
  collapsed?: boolean;
  locked?: boolean;
  hidden?: boolean;
  maskedGroup?: boolean;
  fills?: Fill[];
  hideFillOnExport?: boolean;
  proportion?: number;
  proportionLock?: boolean;
  constraintsH?: 'left' | 'right' | 'leftright' | 'center' | 'scale';
  constraintsV?: 'top' | 'bottom' | 'topbottom' | 'center' | 'scale';
  fixedScroll?: boolean;
  rx?: number;
  ry?: number;
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
};

export type GrowType = 'auto-width' | 'auto-height' | 'fixed';
