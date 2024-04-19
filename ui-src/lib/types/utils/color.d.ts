import { Gradient } from '@ui/lib/types/utils/gradient';
import { ImageColor } from '@ui/lib/types/utils/imageColor';
import { RgbColor } from '@ui/lib/types/utils/rgbColor';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type Color = {
  id?: Uuid;
  name?: string;
  path?: string;
  value?: string;
  color?: RgbColor;
  opacity?: number;
  modifiedAt?: string; //@TODO: check this attribute in penpot
  refId?: Uuid;
  refFile?: Uuid;
  gradient: Gradient;
  image?: ImageColor;
};
