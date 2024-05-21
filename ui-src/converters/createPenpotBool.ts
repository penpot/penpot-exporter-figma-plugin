import { createPenpotItem } from '@ui/converters/createPenpotItem';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { translateFillGradients, translateUiBlendMode } from '@ui/translators';

export const createPenpotBool = (
  file: PenpotFile,
  { type, fills, blendMode, children = [], ...rest }: BoolShape
): Uuid => {
  const shapes: Uuid[] = [];
  for (const child of children) {
    const id = createPenpotItem(file, child);
    if (id) {
      shapes.push(file.lookupShape(id).id);
    }
  }

  const id = file.addBool({
    fills: translateFillGradients(fills),
    blendMode: translateUiBlendMode(blendMode),
    shapes,
    ...rest
  });

  file.closeBool();

  return id;
};
