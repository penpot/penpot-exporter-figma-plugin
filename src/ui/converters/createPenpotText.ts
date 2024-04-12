import { PenpotFile } from '../lib/penpot';
import { TEXT_TYPE } from '../lib/types/text/textAttributes';
import { TextShape } from '../lib/types/text/textShape';

export const createPenpotText = (
  file: PenpotFile,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { type, ...rest }: TextShape
) => {
  file.createText({
    type: TEXT_TYPE,
    ...rest
  });
};
