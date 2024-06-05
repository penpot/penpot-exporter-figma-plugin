import { Gradient } from './gradient';
import { ImageColor, PartialImageColor } from './imageColor';
import { Uuid } from './uuid';

export type Fill = {
  fillColor?: string;
  fillOpacity?: number;
  fillColorGradient?: Gradient;
  fillColorRefFile?: Uuid;
  fillColorRefId?: Uuid;
  fillImage?: ImageColor | PartialImageColor; // @TODO: move to any other place
};
