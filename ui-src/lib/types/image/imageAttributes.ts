import { Uuid } from '@ui/lib/types/utils/uuid';

export const IMAGE_TYPE: unique symbol = Symbol.for('image');

export type ImageAttributes = {
  type: 'image' | typeof IMAGE_TYPE;
  dataUri?: string; //@TODO: check how this works because it's not defined in penpot, it's just used in the export
  metadata: {
    width: number;
    height: number;
    mtype?: string;
    id?: Uuid;
  };
};
