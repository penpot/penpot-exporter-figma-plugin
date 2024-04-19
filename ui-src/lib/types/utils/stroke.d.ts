import { Gradient } from '@ui/lib/types/utils/gradient';
import { ImageColor } from '@ui/lib/types/utils/imageColor';
import { Uuid } from '@ui/lib/types/utils/uuid';

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
  strokeImage?: ImageColor;
};

export type StrokeAlignment = 'center' | 'inner' | 'outer';

type StrokeCapLine = 'round' | 'square';
type StrokeCapMarker =
  | 'line-arrow'
  | 'triangle-arrow'
  | 'square-marker'
  | 'circle-marker'
  | 'diamond-marker';

type StrokeCaps = StrokeCapLine | StrokeCapMarker;
