import { PenpotFile } from '@ui/lib/types/penpotFile';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { translateFillGradients, translateUiBlendMode } from '@ui/translators';

import { Options } from '.';

export const createPenpotRectangle = (
  file: PenpotFile,
  { type, fills, blendMode, ...rest }: RectShape,
  options?: Options
) => {
  file.createRect({
    fills: translateFillGradients(fills),
    blendMode: translateUiBlendMode(blendMode),
    ...applyOptions(options),
    ...rest
  });
};

const applyOptions = (options: Options | undefined) => {
  if (!options) return {};

  return {
    componentId: options.componentId,
    mainInstance: options.mainInstance ? true : undefined,
    componentRoot: true
  };
};
