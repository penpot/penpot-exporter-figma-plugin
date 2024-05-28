import { Gradient } from './gradient';
import { ImageColor } from './imageColor';
import { Uuid } from './uuid';

export type Fill = {
  fillColor?: string;
  fillOpacity?: number;
  fillColorGradient?: Gradient;
  fillColorRefFile?: Uuid;
  fillColorRefId?: Uuid;
  fillImage?: ImageColor;
};
