import { Uuid } from '../utils/uuid';
import { BoolContent } from './boolContent';

export type BoolAttributes = {
  id?: Uuid;
  type: symbol; // bool
  shapes?: Uuid[];
  boolType: string; // @TODO: in Penpot this is of type :keyword. check if it makes sense
  boolContent: BoolContent[];
};
