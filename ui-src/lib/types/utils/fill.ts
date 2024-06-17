import { Gradient } from './gradient';
import { ImageColor, PartialImageColor } from './imageColor';
import { Uuid } from './uuid';

export type Fill = {
  'fill-color'?: string;
  'fill-opacity'?: number;
  'fill-color-gradient'?: Gradient;
  'fill-color-ref-file'?: Uuid;
  'fill-color-ref-id'?: Uuid;
  'fill-image'?: ImageColor | PartialImageColor; // @TODO: move to any other place
};
