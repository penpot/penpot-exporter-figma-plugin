import { Gradient } from './gradient';
import { ImageColor, PartialImageColor } from './imageColor';
import { Uuid } from './uuid';

export type Stroke = {
  'stroke-color'?: string;
  'stroke-color-ref-file'?: Uuid;
  'stroke-color-ref-id'?: Uuid;
  'stroke-opacity'?: number;
  'stroke-style'?: 'solid' | 'dotted' | 'dashed' | 'mixed' | 'none' | 'svg';
  'stroke-width'?: number;
  'stroke-alignment'?: StrokeAlignment;
  'stroke-cap-start'?: StrokeCaps;
  'stroke-cap-end'?: StrokeCaps;
  'stroke-color-gradient'?: Gradient;
  'stroke-image'?: ImageColor | PartialImageColor;
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
