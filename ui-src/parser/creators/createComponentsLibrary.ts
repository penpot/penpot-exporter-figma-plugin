import { toArray } from '@common/map';
import { sleep } from '@common/sleep';

import { sendMessage } from '@ui/context';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { UiComponent, componentShapes, components as uiComponents } from '@ui/parser';
import { symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createComponentsLibrary = async (file: PenpotFile) => {
  let componentsBuilt = 1;
  const components = toArray(uiComponents);

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: components.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'components'
  });

  for (const [_, uiComponent] of components) {
    createComponentLibrary(file, uiComponent);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: componentsBuilt++
    });

    await sleep(0);
  }
};

const createComponentLibrary = (file: PenpotFile, uiComponent: UiComponent) => {
  const componentShape = componentShapes.get(uiComponent.componentFigmaId);

  if (!componentShape) {
    return;
  }

  const { children = [], ...shape } = componentShape;

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
