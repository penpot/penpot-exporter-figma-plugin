import { Uuid } from './uuid';

//@TODO: check how this exports the image through a dataUri
export type ImageColor = {
  name?: string;
  width: number;
  height: number;
  mtype?: string;
  id?: Uuid;
  keepAspectRatio?: boolean;
  dataUri?: string;
};
