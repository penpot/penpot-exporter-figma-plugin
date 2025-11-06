import { getUserData } from '@plugin/getUserData';
import { handleExportMessage, handleRetryMessage } from '@plugin/handleMessage';

const BASE_HEIGHT = 135;
const BASE_WIDTH = 290;

const onMessage: MessageEventHandler = message => {
  if (message.type === 'ready') {
    getUserData();
  }

  if (message.type === 'retry') {
    handleRetryMessage();
  }

  if (message.type === 'export') {
    handleExportMessage();
  }

  if (message.type === 'cancel') {
    figma.closePlugin();
  }

  if (message.type === 'resize') {
    figma.ui.resize(BASE_WIDTH, message.height);
  }
};

figma.showUI(__html__, { themeColors: true, width: BASE_WIDTH, height: BASE_HEIGHT });
figma.ui.onmessage = onMessage;
