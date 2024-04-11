import { Uuid } from '../utils/uuid';

export type ImageAttributes = {
  id?: Uuid;
  type: symbol;
  // TODO: Investigate where it comes from
  dataUri?: string;
  metadata: {
    width: number;
    height: number;
    mtype?: string;
    id?: Uuid;
  };
};
