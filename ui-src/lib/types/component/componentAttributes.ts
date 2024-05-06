import { Uuid } from '../utils/uuid';

export const COMPONENT_TYPE: unique symbol = Symbol.for('component');

export type ComponentAttributes = {
  type: 'component' | typeof COMPONENT_TYPE;
  name: string;
  path: '';
  mainInstanceId: Uuid;
  mainInstancePage: Uuid;
};
