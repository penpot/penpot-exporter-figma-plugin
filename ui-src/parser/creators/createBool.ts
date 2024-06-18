import { PenpotFile } from '@ui/lib/types/penpotFile';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBoolType, symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createBool = (
  file: PenpotFile,
  { type, fills, strokes, boolType, figmaId, figmaRelatedId, children = [], ...rest }: BoolShape
) => {
  file.addBool({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    fills: symbolFills(fills),
    strokes: symbolStrokes(strokes),
    boolType: symbolBoolType(boolType),
    ...rest
  });

  createItems(file, children);

  file.closeBool();
};
