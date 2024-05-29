import {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import { Children } from '@ui/lib/types/utils/children';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type ComponentShape = ShapeBaseAttributes &
  ShapeAttributes &
  ShapeGeomAttributes &
  ComponentAttributes &
  Children;

export type ComponentAttributes = {
  type?: 'component';
  name: string;
  path: '';
  mainInstanceId?: Uuid;
  mainInstancePage?: Uuid;
};