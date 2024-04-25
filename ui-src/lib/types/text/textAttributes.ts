import { TextContent, TextStyle } from './textContent';

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
  text?: string;
} & TextStyle;
