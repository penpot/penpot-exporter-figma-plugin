import { Uuid } from '@ui/lib/types/utils/uuid';

import { BoolContent } from './boolContent';

export const BOOL_TYPE: unique symbol = Symbol.for('bool');

export type BoolAttributes = {
  type: 'bool' | typeof BOOL_TYPE;
  shapes?: Uuid[];
  boolType: string; // @TODO: in Penpot this is of type :keyword. check if it makes sense
  boolContent: BoolContent[];
};
