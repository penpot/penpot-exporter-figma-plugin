import { transformDocumentNode } from '@plugin/transformers';
import { setCustomFontId } from '@plugin/translators/text/font/custom';

export const handleExportMessage = async (missingFontIds: Record<string, string>) => {
  Object.entries(missingFontIds).forEach(([fontFamily, fontId]) => {
    setCustomFontId(fontFamily, fontId);
  });

  figma.ui.postMessage({
    type: 'PENPOT_DOCUMENT',
    data: await transformDocumentNode(figma.root)
  });
};
