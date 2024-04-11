import { Uuid } from '../utils/uuid';
import { TextContent } from './textContent';

export type TextAttributes = {
  id?: Uuid;
  type: symbol;
  content?: TextContent;
};
