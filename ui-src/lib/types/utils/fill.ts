import { Color } from '@ui/lib/types/utils/color';

import { Gradient } from './gradient';
import { ImageColor, PartialImageColor } from './imageColor';
import { Uuid } from './uuid';

export type Fill = FigmaFill | PenpotFill;

// @TODO: move to any other place
type FigmaFill = {
  fillColor?: string;
  fillOpacity?: number;
  fillColorGradient?: Gradient;
  fillColorRefFile?: Uuid;
  fillColorRefId?: Uuid;
  fillImage?: PartialImageColor;
};

type PenpotFill = {
  fillColor?: string;
  fillOpacity?: number;
  fillColorGradient?: Gradient;
  fillColorRefFile?: Uuid;
  fillColorRefId?: Uuid;
  fillImage?: ImageColor;
};

export type FillStyle = {
  name: string;
  fills: Fill[];
  colors: Color[];
};
