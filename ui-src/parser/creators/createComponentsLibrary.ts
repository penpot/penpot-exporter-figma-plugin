import { toArray } from '@common/map';
import { sleep } from '@common/sleep';

import { sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { PenpotComponent } from '@ui/lib/types/shapes/componentShape';
import { componentShapes, components as uiComponents } from '@ui/parser';
import type { UiComponent } from '@ui/types';

export const createComponentsLibrary = async (context: PenpotContext): Promise<void> => {
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

const createComponentLibrary = (context: PenpotContext, uiComponent: UiComponent): void => {
  const componentShape = componentShapes.get(uiComponent.componentFigmaId);

  if (!componentShape) {
    return;
  }

  const penpotComponent: PenpotComponent = {
    componentId: uiComponent.componentId,
    fileId: context.currentFileId,
    name: componentShape.name,
    frameId: uiComponent.mainInstanceId,
    pageId: uiComponent.mainInstancePage,
    path: '\0'
  };

  if (uiComponent.variantId) {
    penpotComponent.variantId = uiComponent.variantId;
  }

  if (uiComponent.variantProperties) {
    penpotComponent.variantProperties = uiComponent.variantProperties;
  }

  context.addComponent(penpotComponent);
};
