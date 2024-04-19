import {
  handleCancelMessage,
  handleExportMessage,
  handleResizeMessage
} from '@plugin/messageHandlers';

figma.showUI(__html__, { themeColors: true, height: 200, width: 300 });

figma.ui.onmessage = async msg => {
  if (msg.type === 'export') {
    await handleExportMessage();
  }
  if (msg.type === 'cancel') {
    handleCancelMessage();
  }
  if (msg.type === 'resize') {
    handleResizeMessage(msg.width, msg.height);
  }
};
