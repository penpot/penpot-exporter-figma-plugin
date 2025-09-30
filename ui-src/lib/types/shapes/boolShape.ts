import type { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import type {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import type { Children } from '@ui/lib/types/utils/children';
import type { Uuid } from '@ui/lib/types/utils/uuid';

export const BOOL_DIFFERENCE: unique symbol = Symbol.for('difference');
export const BOOL_UNION: unique symbol = Symbol.for('union');
export const BOOL_INTERSECTION: unique symbol = Symbol.for('intersection');
export const BOOL_EXCLUDE: unique symbol = Symbol.for('exclude');

export type BoolOperations =
  | 'difference'
  | 'union'
  | 'intersection'
  | 'exclude'
  | typeof BOOL_DIFFERENCE
  | typeof BOOL_UNION
  | typeof BOOL_INTERSECTION
  | typeof BOOL_EXCLUDE;

export type BoolShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  BoolAttributes &
  LayoutChildAttributes &
  Children;

export type PenpotBool = {
  groupId: Uuid;
  type: BoolOperations;
};

type BoolAttributes = {
  type?: 'bool';
  shapes?: Uuid[];
  boolType: BoolOperations;
};
