import { componentsLibrary } from '@plugin/ComponentLibrary';
import { sleep } from '@plugin/utils/sleep';

import { sendMessage } from '@ui/context';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { symbolBlendMode, symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';
import { uiComponents } from '@ui/parser/libraries';

import { createItems } from '.';

export const createComponentLibrary = async (file: PenpotFile) => {
  let componentsBuilt = 1;
  const components = uiComponents.all();

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: components.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'components'
  });

  for (const uiComponent of components) {
    const component = componentsLibrary.get(uiComponent.componentFigmaId);

    if (!component) {
      return;
    }

    const { children = [], fills, strokes, blendMode, ...rest } = component;

    file.startComponent({
      ...rest,
      fills: symbolFills(fills),
      strokes: symbolStrokes(strokes),
      blendMode: symbolBlendMode(blendMode),
      id: uiComponent.componentId,
      componentId: uiComponent.componentId,
      mainInstancePage: uiComponent.mainInstancePage,
      mainInstanceId: uiComponent.mainInstanceId,
      componentRoot: true,
      mainInstance: true,
      componentFile: file.getId()
    });

    createItems(file, children);

    file.finishComponent();

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: componentsBuilt++
    });

    await sleep(0);
  }
};
