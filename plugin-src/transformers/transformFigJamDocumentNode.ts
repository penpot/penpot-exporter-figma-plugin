import { processPages } from '@plugin/processors';
import { buildPenpotDocument } from '@plugin/transformers';

import type { PenpotDocument } from '@ui/types';

export const transformFigJamDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  const children = await processPages(node, 'all');
  return buildPenpotDocument(node.name, children);
};
