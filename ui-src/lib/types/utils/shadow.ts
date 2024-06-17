import { Color } from './color';
import { Uuid } from './uuid';

export type ShadowStyle = 'drop-shadow' | 'inner-shadow';

export type Shadow = {
  'id'?: Uuid;
  'style': ShadowStyle;
  'offset-x': number;
  'offset-y': number;
  'blur': number;
  'spread': number;
  'hidden': boolean;
  'color': Color;
};
