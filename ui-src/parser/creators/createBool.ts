import { PenpotFile } from '@ui/lib/types/penpotFile';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { parseFigmaId } from '@ui/parser';
import {
  symbolBlendMode,
  symbolBoolType,
  symbolFills,
  symbolStrokes
} from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createBool = (
  file: PenpotFile,
  {
    type,
    fills,
    strokes,
    boolType,
    blendMode,
    figmaId,
    figmaRelatedId,
    children = [],
    ...rest
  }: BoolShape
) => {
  file.addBool({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    fills: symbolFills(fills),
    strokes: symbolStrokes(strokes),
    blendMode: symbolBlendMode(blendMode),
    boolType: symbolBoolType(boolType),
    ...rest
  });

  createItems(file, children);

  file.closeBool();
};
