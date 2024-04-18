import { Uuid } from '@ui/lib/types/utils/uuid';

//@TODO: check how this exports the image through a dataUri
export type ImageColor = {
  name?: string;
  width: number;
  height: number;
  mtype?: string;
  id?: Uuid;
  keepAspectRatio?: boolean;
};
