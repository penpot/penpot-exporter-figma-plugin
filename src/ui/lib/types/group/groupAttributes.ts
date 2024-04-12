import { Uuid } from '../utils/uuid';

export const GROUP_TYPE: unique symbol = Symbol.for('group');

export type GroupAttributes = {
  type: 'group' | typeof GROUP_TYPE;
  id?: Uuid;
  shapes?: Uuid[];
};
