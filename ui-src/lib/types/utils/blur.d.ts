import { Uuid } from './uuid';

export type Blur = {
  id: Uuid;
  type: symbol; // layer-blur
  value: number;
  hidden: boolean;
};
