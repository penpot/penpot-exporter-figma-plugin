import { Gradient } from './gradient';
import { Uuid } from './uuid';

type ShadowStyle = 'drop-shadow' | 'inner-shadow';

export type Shadow = {
  id?: Uuid;
  style: ShadowStyle;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  hidden: boolean;
  color: {
    color?: string;
    opacity?: number;
    gradient?: Gradient;
    fileId?: Uuid;
    id?: Uuid;
  };
};
