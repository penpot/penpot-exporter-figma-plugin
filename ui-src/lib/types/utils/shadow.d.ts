import { Color } from '@ui/lib/types/utils/color';

import { Uuid } from './uuid';

export type Shadow = {
  id?: Uuid;
  style: symbol; // 'drop-shadow' | 'inner-shadow'
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  hidden: boolean;
  color: Color;
};
