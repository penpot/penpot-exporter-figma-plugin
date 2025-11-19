import { translateGrids } from '@plugin/translators/translateLayoutGrids';

import type { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformGrids = (node: BaseFrameMixin): Pick<ShapeAttributes, 'grids'> => {
  return {
    grids: translateGrids(node.layoutGrids)
  };
};
