import { Uuid } from '../utils/uuid';

export type GroupAttributes = {
  id?: Uuid;
  type: symbol;
  shapes?: Uuid[];
};
