import { Uuid } from './uuid';

export type ImageColor = {
  name?: string;
  width: number;
  height: number;
  mtype?: string;
  id?: Uuid;
  keepAspectRatio?: boolean;
  dataUri?: string;
  imageHash?: string; // @TODO: move to any other place
};
