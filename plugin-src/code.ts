import { findAllTextNodes } from './findAllTextnodes';
import { handleExportMessage } from './handleExportMessage';
import { BASE_WIDTH, LOADING_HEIGHT } from './pluginSizes';
import { registerChange } from './registerChange';

figma.showUI(__html__, { themeColors: true, width: BASE_WIDTH, height: LOADING_HEIGHT });

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
};

figma.on('currentpagechange', () => {
  figma.currentPage.once('nodechange', registerChange);
});
