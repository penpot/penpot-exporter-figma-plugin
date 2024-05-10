import { findAllTextNodes } from './findAllTextnodes';
import { handleExportMessage } from './handleExportMessage';
import { BASE_WIDTH, NORMAL_HEIGHT, ROOT_OFFSET } from './pluginSizes';
import { registerChange } from './registerChange';

figma.showUI(__html__, { themeColors: true, width: BASE_WIDTH, height: NORMAL_HEIGHT });

figma.ui.onmessage = message => {
  if (message.type === 'ready') {
    findAllTextNodes();
  }

  if (message.type === 'export') {
    // Give the plugin time to resize before exporting
    setTimeout(() => {
      handleExportMessage(message.data as Record<string, string>);
    }, 100);
  }

  if (message.type === 'cancel') {
    figma.closePlugin();
  }

  if (message.type === 'reload') {
    findAllTextNodes();
  }

  if (message.type === 'resize') {
    figma.ui.resize(BASE_WIDTH, message.height + ROOT_OFFSET);
  }
};

figma.on('currentpagechange', () => {
  figma.currentPage.once('nodechange', registerChange);
});
