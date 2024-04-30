import { transformDocumentNode } from '@plugin/transformers';

import { findAllTextNodes } from './findAllTextnodes';

figma.showUI(__html__, { themeColors: true, height: 200, width: 300 });

figma.ui.onmessage = message => {
  if (message.type === 'ready') {
    findAllTextNodes();
  }

  if (message.type === 'export') {
    handleExportMessage();
  }

  if (message.type === 'cancel') {
    figma.closePlugin();
  }

  if (message.type === 'resize') {
    figma.ui.resize(message.width, message.height);
  }
};

const handleExportMessage = async () => {
  await figma.loadAllPagesAsync();

  figma.ui.postMessage({
    type: 'PENPOT_DOCUMENT',
    data: await transformDocumentNode(figma.root)
  });
};
