import { PathContent } from '@ui/lib/types/path/PathContent';

export const PATH_TYPE: unique symbol = Symbol.for('path');

export type PathAttributes = {
  type: 'path' | typeof PATH_TYPE;
  content: PathContent;
};
