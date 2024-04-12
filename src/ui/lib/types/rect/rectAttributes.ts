import { Uuid } from '@ui/lib/types/utils/uuid';

export const RECT_TYPE: unique symbol = Symbol.for('rect');

export type RectAttributes = {
  type: 'rect' | typeof RECT_TYPE;
  id?: Uuid;
};
