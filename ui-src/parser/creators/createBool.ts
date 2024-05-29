import { PenpotFile } from '@ui/lib/types/penpotFile';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { createItem } from '@ui/parser/creators/createItem';
import { symbolBlendMode, symbolBoolType, symbolFillGradients } from '@ui/parser/creators/symbols';

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

  for (const child of children) {
    createItem(file, child);
  }

  file.closeBool();
};
