import { PenpotFile } from '@ui/lib/types/penpotFile';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { createPenpotItem } from '@ui/parser/creators/createPenpotItem';
import { symbolBlendMode, symbolBoolType, symbolFillGradients } from '@ui/parser/creators/symbols';

export const createPenpotBool = (
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
    createPenpotItem(file, child);
  }

  file.closeBool();
};
