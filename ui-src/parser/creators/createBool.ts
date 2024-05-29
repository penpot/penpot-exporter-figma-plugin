import { PenpotFile } from '@ui/lib/types/penpotFile';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { symbolBlendMode, symbolBoolType, symbolFillGradients } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createBool = (
  file: PenpotFile,
  { type, fills, boolType, blendMode, children = [], ...rest }: BoolShape
) => {
  file.addBool({
    fills: symbolFillGradients(fills),
    blendMode: symbolBlendMode(blendMode),
    boolType: symbolBoolType(boolType),
    ...rest
  });

  createItems(file, children);

  file.closeBool();
};
