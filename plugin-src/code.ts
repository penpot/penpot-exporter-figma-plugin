import { getUserData } from '@plugin/getUserData';
import {
  handleExportMessage,
  handleExternalVariablesChoice,
  handleRetryMessage
} from '@plugin/handleMessage';

import type { ExportScope, ExternalLibrary, ExternalVariablesChoice } from '@ui/types';

const BASE_HEIGHT = 500;
const BASE_WIDTH = 560;

type ExportMessage = {
  type: 'export';
  data: {
    scope: ExportScope;
    libraries: ExternalLibrary[];
  };
};

type ExternalVariablesChoiceMessage = {
  type: 'external_variables_choice';
  data: {
    choice: ExternalVariablesChoice;
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
    const libraries = exportMessage.data?.libraries ?? [];

    handleExportMessage(scope, libraries);
  }

  if (message.type === 'external_variables_choice') {
    const choiceMessage = message as ExternalVariablesChoiceMessage;
    const choice = choiceMessage.data?.choice;

    if (choice) {
      handleExternalVariablesChoice(choice);
    }
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

figma.teamLibrary
  .getAvailableLibraryVariableCollectionsAsync()
  .then(collections => {
    const libraryNames = Array.from(
      new Set(
        collections
          .map(collection => collection.libraryName)
          .filter((name): name is string => Boolean(name))
      )
    );

    figma.ui.postMessage({
      type: 'EXTERNAL_LIBRARIES',
      data: libraryNames
    });
  })
  .catch(error => {
    console.warn('Could not fetch external libraries', error);
  });
