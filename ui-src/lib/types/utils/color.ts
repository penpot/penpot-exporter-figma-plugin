import { Gradient } from './gradient';
import { ImageColor, PartialImageColor } from './imageColor';
import { Uuid } from './uuid';

export type Color = FigmaColor | PenpotColor;

// @TODO: move to any other place
type FigmaColor = {
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
  image?: PartialImageColor;
};

type PenpotColor = {
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
