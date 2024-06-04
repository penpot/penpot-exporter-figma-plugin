import { PenpotFile } from '@ui/lib/types/penpotFile';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode, symbolBoolType, symbolFills } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createBool = (
  file: PenpotFile,
  { type, fills, boolType, blendMode, figmaId, figmaRelatedId, children = [], ...rest }: BoolShape,
  remote: boolean = false
) => {
  file.addBool({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    fills: symbolFills(fills),
    blendMode: symbolBlendMode(blendMode),
    boolType: symbolBoolType(boolType),
    ...rest
  });

  createItems(file, children, remote);

  file.closeBool();
};
