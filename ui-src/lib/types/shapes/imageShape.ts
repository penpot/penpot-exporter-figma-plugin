import { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type ImageShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  ImageAttributes &
  LayoutChildAttributes;

type ImageAttributes = {
  type?: 'image';
  dataUri?: string; //@TODO: check how this works because it's not defined in penpot, it's just used in the export
  metadata: {
    width: number;
    height: number;
    mtype?: string;
    id?: Uuid;
  };
};
