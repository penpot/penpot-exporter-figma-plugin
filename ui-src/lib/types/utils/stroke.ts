import { Gradient } from './gradient';
import { ImageColor, PartialImageColor } from './imageColor';
import { Uuid } from './uuid';

export type Stroke = {
  strokeColor?: string;
  strokeColorRefFile?: Uuid;
  strokeColorRefId?: Uuid;
  strokeOpacity?: number;
  strokeStyle?: 'solid' | 'dotted' | 'dashed' | 'mixed' | 'none' | 'svg';
  strokeWidth?: number;
  strokeAlignment?: StrokeAlignment;
  strokeCapStart?: StrokeCaps;
  strokeCapEnd?: StrokeCaps;
  strokeColorGradient?: Gradient;
  strokeImage?: ImageColor | PartialImageColor;
};

export type StrokeAlignment = 'center' | 'inner' | 'outer';

type StrokeCapLine = 'round' | 'square';
type StrokeCapMarker =
  | 'line-arrow'
  | 'triangle-arrow'
  | 'square-marker'
  | 'circle-marker'
  | 'diamond-marker';

export type StrokeCaps = StrokeCapLine | StrokeCapMarker;
