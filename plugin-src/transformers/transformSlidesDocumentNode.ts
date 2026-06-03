import { processSlides } from '@plugin/processors';
import { buildPenpotDocument } from '@plugin/transformers';

import type { PenpotDocument } from '@ui/types';

export const transformSlidesDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  const children = await processSlides(node);
  return buildPenpotDocument(node.name, children);
};
