import { Fill } from '../utils/fill';
import { TextContent } from './textContent';

export const TEXT_TYPE: unique symbol = Symbol.for('text');

export type TextAttributes = {
  type: 'text' | typeof TEXT_TYPE;
  content?: TextContent;
  positionData: PositionData[];
};

export type PositionData = {
  // @TODO: figure out how to manage position and dimension
  x?: number;
  y?: number;
  height?: number;
  width?: number;
  fills?: Fill[];
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: string;
  fontWeight?: string;
  rtl?: boolean;
  text?: string;
  textDecoration?: string;
  textTransform?: string;
};
