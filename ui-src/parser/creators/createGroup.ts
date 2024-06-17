import { PenpotFile } from '@ui/lib/types/penpotFile';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createGroup = (
  file: PenpotFile,
  { type, 'blend-mode': blendMode, children = [], figmaId, figmaRelatedId, ...rest }: GroupShape
) => {
  file.addGroup({
    'id': parseFigmaId(file, figmaId),
    'shape-ref': parseFigmaId(file, figmaRelatedId, true),
    'blend-mode': symbolBlendMode(blendMode),
    ...rest
  });

  createItems(file, children);

  file.closeGroup();
};
