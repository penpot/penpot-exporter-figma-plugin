import { transformDocumentNode } from '@plugin/transformers';

import { findAllTextNodes } from './findAllTextnodes';
import { setCustomFontId } from './translators/text/custom';

figma.showUI(__html__, { themeColors: true, height: 300, width: 400 });

figma.ui.onmessage = message => {
  if (message.type === 'ready') {
    findAllTextNodes();
  }

  if (message.type === 'export') {
    handleExportMessage(message.data as Record<string, string>);
  }

  if (message.type === 'cancel') {
    figma.closePlugin();
  }
};

const handleExportMessage = async (missingFontIds: Record<string, string>) => {
  await figma.loadAllPagesAsync();

  Object.entries(missingFontIds).forEach(([fontFamily, fontId]) => {
    setCustomFontId(fontFamily, fontId);
  });

  figma.ui.postMessage({
    type: 'PENPOT_DOCUMENT',
    data: await transformDocumentNode(figma.root)
  });
};
