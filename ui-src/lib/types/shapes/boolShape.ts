import { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import { PathContent } from '@ui/lib/types/shapes/pathShape';
import { ShapeAttributes, ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';
import { Children } from '@ui/lib/types/utils/children';
import { Point } from '@ui/lib/types/utils/point';
import { Uuid } from '@ui/lib/types/utils/uuid';

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
  ShapeAttributes &
  BoolAttributes &
  LayoutChildAttributes &
  Children;

type BoolAttributes = {
  type?: 'bool';
  shapes?: Uuid[];
  boolType: BoolOperations;
  boolContent?: BoolContent[];
};

type BoolContent = {
  relative?: boolean;
  prevPos?: Point;
} & PathContent;
