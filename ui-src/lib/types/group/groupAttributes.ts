import { Uuid } from '@ui/lib/types/utils/uuid';

export const GROUP_TYPE: unique symbol = Symbol.for('group');

export type GroupAttributes = {
  type: 'group' | typeof GROUP_TYPE;
  shapes?: Uuid[];
};
