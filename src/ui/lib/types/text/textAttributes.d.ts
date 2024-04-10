import { TextContent } from './textContent';

export type TextAttributes = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id?: any;
  type: symbol;
  content?: TextContent;
};
