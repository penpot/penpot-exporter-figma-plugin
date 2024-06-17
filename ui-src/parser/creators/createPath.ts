import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { parseFigmaId } from '@ui/parser';
import {
  symbolBlendMode,
  symbolFills,
  symbolPathContent,
  symbolStrokes
} from '@ui/parser/creators/symbols';

export const createPath = (
  file: PenpotFile,
  {
    type,
    fills,
    strokes,
    'blend-mode': blendMode,
    content,
    figmaId,
    figmaRelatedId,
    ...rest
  }: PathShape
) => {
  file.createPath({
    'id': parseFigmaId(file, figmaId),
    'shape-ref': parseFigmaId(file, figmaRelatedId, true),
    'fills': symbolFills(fills),
    'strokes': symbolStrokes(strokes),
    'blend-mode': symbolBlendMode(blendMode),
    'content': symbolPathContent(content),
    ...rest
  });
};
