import { TextContent } from './textContent';

export const TEXT_TYPE: unique symbol = Symbol.for('text');

export type TextAttributes = {
  type?: 'text';
  content?: TextContent;
};
