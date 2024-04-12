import { Point } from '@ui/lib/types/utils/point';

export type BoolContent = {
  command: string; // @TODO: in Penpot this is of type :keyword. check if it makes sense
  relative?: boolean;
  prevPos?: Point;
  params?: { [keyword: string]: number }; // @TODO: in Penpot this is of type :keyword. check if it makes sense
};
