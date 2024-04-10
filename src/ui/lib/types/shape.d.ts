import { Point } from './utils/point';
import { Selrect } from './utils/selrect';

export type Shape = {
  name?: string;
  componentId?: string;
  componentFile?: string;
  componentRoot?: boolean;
  shapeRef?: string;
  selrect?: Selrect;
  points?: Point[];
  blocked?: boolean;
  collapsed?: boolean;
  locked?: boolean;
  hidden?: boolean;
  maskedGroup?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fills?: any;
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
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grids?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exports?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strokes?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformInverse?: any;
  blendMode?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interactions?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shadow?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blur?: any;
  growType?: 'auto-width' | 'auto-height' | 'fixed';
};
