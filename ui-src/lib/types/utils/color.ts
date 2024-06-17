import { Gradient } from './gradient';
import { ImageColor } from './imageColor';
import { Uuid } from './uuid';

export type Color = {
  'id'?: Uuid;
  'name'?: string;
  'path'?: string;
  'value'?: string;
  'color'?: string; // hex color
  'opacity'?: number;
  'modified-at'?: string; //@TODO: check this attribute in penpot
  'ref-id'?: Uuid;
  'ref-file'?: Uuid;
  'gradient'?: Gradient;
  'image'?: ImageColor;
};
