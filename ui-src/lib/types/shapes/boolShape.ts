import { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import { ShapeAttributes, ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';
import { Point } from '@ui/lib/types/utils/point';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type BoolShape = ShapeBaseAttributes &
  ShapeAttributes &
  BoolAttributes &
  LayoutChildAttributes;

type BoolAttributes = {
  type?: 'bool';
  shapes?: Uuid[];
  boolType: string; // @TODO: in Penpot this is of type :keyword. check if it makes sense
  boolContent: BoolContent[];
};

type BoolContent = {
  command: string; // @TODO: in Penpot this is of type :keyword. check if it makes sense
  relative?: boolean;
  prevPos?: Point;
  params?: { [keyword: string]: number }; // @TODO: in Penpot this is of type :keyword. check if it makes sense
};
