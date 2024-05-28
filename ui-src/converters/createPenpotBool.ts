import { createPenpotItem } from '@ui/converters/createPenpotItem';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { translateFillGradients, translateUiBlendMode, translateUiBoolType } from '@ui/translators';

export const createPenpotBool = (
  file: PenpotFile,
  { type, fills, boolType, blendMode, children = [], ...rest }: BoolShape
) => {
  file.addBool({
    fills: translateFillGradients(fills),
    blendMode: translateUiBlendMode(blendMode),
    boolType: translateUiBoolType(boolType),
    ...rest
  });

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.closeBool();
};
