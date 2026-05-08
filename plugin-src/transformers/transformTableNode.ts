import { transformNodeAsImageRect } from '@plugin/transformers/transformNodeAsImageRect';

import type { RectShape } from '@ui/lib/types/shapes/rectShape';

export const transformTableNode = (node: TableNode): Promise<RectShape | undefined> =>
  transformNodeAsImageRect(node);
