import { Gradient } from './gradient';
import { ImageColor } from './imageColor';
import { Uuid } from './uuid';

export type Color = {
  id?: Uuid;
  name?: string;
  path?: string;
  value?: string;
  color?: string;
  opacity?: number;
  modifiedAt?: string;
  refId?: Uuid;
  refFile?: Uuid;
  gradient?: Gradient;
  image?: ImageColor;
};
