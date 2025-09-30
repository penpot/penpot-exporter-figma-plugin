import { transformDocumentNode } from '@plugin/transformers';

export const handleExportMessage = async (): Promise<void> => {
  figma.ui.postMessage({
    type: 'PENPOT_DOCUMENT',
    data: await transformDocumentNode(figma.root)
  });
};
