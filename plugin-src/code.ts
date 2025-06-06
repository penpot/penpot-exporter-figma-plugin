import { findAllTextNodes } from '@plugin/findAllTextnodes';
import { getUserData } from '@plugin/getUserData';
import { handleExportMessage } from '@plugin/handleExportMessage';
import { registerChange } from '@plugin/registerChange';

const BASE_HEIGHT = 135;
const BASE_WIDTH = 290;

figma.showUI(__html__, { themeColors: true, width: BASE_WIDTH, height: BASE_HEIGHT });

figma.ui.onmessage = message => {
  if (message.type === 'ready') {
    getUserData();
    findAllTextNodes();
  }

  if (message.type === 'export') {
    handleExportMessage();
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

let currentPage = figma.currentPage;

currentPage.on('nodechange', registerChange);

figma.on('currentpagechange', () => {
  currentPage.off('nodechange', registerChange);

  currentPage = figma.currentPage;

  currentPage.on('nodechange', registerChange);
});
