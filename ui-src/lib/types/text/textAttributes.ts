import { TextContent, TextNode } from './textContent';

export const TEXT_TYPE: unique symbol = Symbol.for('text');

export type TextAttributes = {
  type: 'text' | typeof TEXT_TYPE;
  content?: TextContent;
  positionData: TextNode[];
};
