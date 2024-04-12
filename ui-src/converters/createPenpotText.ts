import { PenpotFile } from '@ui/lib/penpot';
import { TEXT_TYPE } from '@ui/lib/types/text/textAttributes';
import { TextShape } from '@ui/lib/types/text/textShape';

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
