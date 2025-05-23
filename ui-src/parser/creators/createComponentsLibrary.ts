import { toArray } from '@common/map';
import { sleep } from '@common/sleep';

import { sendMessage } from '@ui/context';
import { PenpotContext } from '@ui/lib/types/penpotContext';
import { PenpotComponent } from '@ui/lib/types/shapes/componentShape';
import { componentShapes, components as uiComponents } from '@ui/parser';
import { UiComponent } from '@ui/types';

export const createComponentsLibrary = async (context: PenpotContext) => {
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
    createComponentLibrary(context, uiComponent);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: componentsBuilt++
    });

    await sleep(0);
  }
};

const createComponentLibrary = (context: PenpotContext, uiComponent: UiComponent) => {
  const componentShape = componentShapes.get(uiComponent.componentFigmaId);

  if (!componentShape) {
    return;
  }

  const penpotComponent = {
    componentId: uiComponent.componentId,
    fileId: context.currentFileId,
    name: componentShape.name,
    frameId: uiComponent.mainInstanceId,
    pageId: uiComponent.mainInstancePage
  } as PenpotComponent;

  context.addComponent(penpotComponent);
};
