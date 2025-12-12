import { getUserData } from '@plugin/getUserData';
import { handleExportMessage, handleRetryMessage } from '@plugin/handleMessage';

import type { ExportScope, ExternalLibrary } from '@ui/types';

const BASE_HEIGHT = 500;
const BASE_WIDTH = 560;

type ExportMessage = {
  type: 'export';
  data: {
    scope: ExportScope;
    libraries: ExternalLibrary[];
  };
};

const onMessage: MessageEventHandler = message => {
  if (message.type === 'ready') {
    getUserData();
  }

  if (message.type === 'retry') {
    handleRetryMessage();
  }

  if (message.type === 'export') {
    const exportMessage = message as ExportMessage;
    const scope = exportMessage.data?.scope ?? 'all';
    const libraries = exportMessage.data?.libraries ?? {};

    handleExportMessage(scope, libraries);
  }

  if (message.type === 'cancel') {
    figma.closePlugin();
  }

  if (message.type === 'resize') {
    const width = message.width ?? BASE_WIDTH;
    const height = message.height ?? BASE_HEIGHT;
    figma.ui.resize(width, height);
  }
};

figma.showUI(__html__, { themeColors: true, width: BASE_WIDTH, height: BASE_HEIGHT });
figma.ui.onmessage = onMessage;

figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync().then(collections => {
  figma.ui.postMessage({
    type: 'EXTERNAL_LIBRARIES',
    data: collections.map(collection => collection.libraryName)
  });
});
