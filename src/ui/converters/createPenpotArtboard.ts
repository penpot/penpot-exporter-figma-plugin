import { PenpotFile } from '../lib/penpot';
import { FRAME_TYPE } from '../lib/types/frame/frameAttributes';
import { FrameShape } from '../lib/types/frame/frameShape';
import { createPenpotItem } from './createPenpotItem';

export const createPenpotArtboard = (
  file: PenpotFile,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { type, children = [], ...rest }: FrameShape
) => {
  file.addArtboard({
    type: FRAME_TYPE,
    ...rest
  });

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.closeArtboard();
};
