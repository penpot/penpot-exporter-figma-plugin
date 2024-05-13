import { findAllTextNodes } from './findAllTextnodes';
import { handleExportMessage } from './handleExportMessage';
import { registerChange } from './registerChange';

const BASE_HEIGHT = 135;
const BASE_WIDTH = 290;

figma.showUI(__html__, { themeColors: true, width: BASE_WIDTH, height: BASE_HEIGHT });

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

  if (message.type === 'reload') {
    findAllTextNodes();
  }

  if (message.type === 'resize') {
    figma.ui.resize(BASE_WIDTH, message.height);
  }
};

figma.on('currentpagechange', () => {
  figma.currentPage.once('nodechange', registerChange);
});
