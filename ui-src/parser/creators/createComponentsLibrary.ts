import { components } from '@plugin/libraries/Components';
import { sleep } from '@plugin/utils/sleep';

import { sendMessage } from '@ui/context';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';
import { UiComponent, components as uiComponents } from '@ui/parser/libraries';

import { createItems } from '.';

export const createComponentsLibrary = async (file: PenpotFile) => {
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
    createComponentLibrary(file, uiComponent);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: componentsBuilt++
    });

    await sleep(0);
  }
};

const createComponentLibrary = async (file: PenpotFile, uiComponent: UiComponent) => {
  const component = components.get(uiComponent.componentFigmaId);

  if (!component) {
    return;
  }

  const { children = [], ...shape } = component;

  shape.fills = symbolFills(shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(shape.strokes);
  shape.id = uiComponent.componentId;
  shape.componentId = uiComponent.componentId;
  shape.mainInstancePage = uiComponent.mainInstancePage;
  shape.mainInstanceId = uiComponent.mainInstanceId;
  shape.componentRoot = true;
  shape.mainInstance = true;
  shape.componentFile = file.getId();

  file.startComponent(shape);

  createItems(file, children);

  file.finishComponent();
};
