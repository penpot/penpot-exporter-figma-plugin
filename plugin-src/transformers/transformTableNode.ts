import { transformNodeAsImageRect } from '@plugin/transformers/transformNodeAsImageRect';

import type { RectShape } from '@ui/lib/types/shapes/rectShape';

// TODO: Look for a better transform solution.
// Currently, rasterized as a image, as a provisional solution.
export const transformTableNode = (node: TableNode): Promise<RectShape | undefined> =>
  transformNodeAsImageRect(node);
