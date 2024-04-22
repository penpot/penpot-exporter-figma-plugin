import { Gradient } from '@ui/lib/types/utils/gradient';
import { ImageColor } from '@ui/lib/types/utils/imageColor';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type Color = {
  id?: Uuid;
  name?: string;
  path?: string;
  value?: string;
  color?: string; // hex color
  opacity?: number;
  modifiedAt?: string; //@TODO: check this attribute in penpot
  refId?: Uuid;
  refFile?: Uuid;
  gradient?: Gradient;
  image?: ImageColor;
};
