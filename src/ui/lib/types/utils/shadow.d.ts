import { Gradient } from './gradient';
import { Uuid } from './uuid';

export type Shadow = {
  id?: Uuid;
  style: symbol; // 'drop-shadow' | 'inner-shadow'
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
