import { Uuid } from '../utils/uuid';

export type GroupAttributes = {
  id?: Uuid;
  type: symbol;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shapes?: any[];
};
