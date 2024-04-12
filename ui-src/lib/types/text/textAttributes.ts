import { Uuid } from '@ui/lib/types/utils/uuid';

import { TextContent } from './textContent';

export const TEXT_TYPE: unique symbol = Symbol.for('text');

export type TextAttributes = {
  id?: Uuid;
  type: 'text' | typeof TEXT_TYPE;
  content?: TextContent;
};
