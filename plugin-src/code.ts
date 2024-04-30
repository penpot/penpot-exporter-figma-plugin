import {
  handleCancelMessage,
  handleExportMessage,
  handleResizeMessage
} from '@plugin/messageHandlers';
import {isGoogleFont} from "@plugin/translators/text/gfonts";
import {isLocalFont} from "@plugin/translators/text/local";

const findAllTextNodes = async () => {
  await figma.loadAllPagesAsync();

  const nodes = figma.root.findAllWithCriteria({
    types: ['TEXT']
  });

  const fonts = new Set<string>;
  nodes.forEach(node => {
    const styledTextSegments = node.getStyledTextSegments(['fontName']);
    styledTextSegments.forEach(segment => {
      if (isGoogleFont(segment.fontName) || isLocalFont(segment.fontName)) {
        return;
      }
      fonts.add(segment.fontName.family);
    });
  });

  figma.ui.postMessage({
    type: 'CUSTOM_FONTS',
    data: Array.from(fonts)
  });
}

figma.showUI(__html__, { themeColors: true, height: 200, width: 300 });

figma.ui.onmessage = async msg => {
  if (msg.type === 'ready') {
    findAllTextNodes();
  }
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
