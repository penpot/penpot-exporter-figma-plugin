import { sleep } from '@common/sleep';

import { sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { PenpotComponent } from '@ui/lib/types/shapes/componentShape';
import { componentShapes, components } from '@ui/parser';
import type { UiComponent } from '@ui/types';

export const createComponentsLibrary = async (context: PenpotContext): Promise<void> => {
  let componentsBuilt = 1;

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: components.size
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'components'
  });

  for (const [_, component] of components.entries()) {
    createComponentLibrary(context, component);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: componentsBuilt++
    });

    await sleep(0);
  }
};

const createComponentLibrary = (context: PenpotContext, component: UiComponent): void => {
  const componentShape = componentShapes.get(component.mainInstanceId);

  if (!componentShape) {
    return;
  }

  const nameSplit = componentShape.name.split(' / ');

  const penpotComponent: PenpotComponent = {
    componentId: component.componentId,
    fileId: context.currentFileId,
    name: nameSplit[nameSplit.length - 1],
    frameId: component.mainInstanceId,
    pageId: component.mainInstancePage,
    path: component.path
  };

  if (component.variantId) {
    penpotComponent.variantId = component.variantId;
  }

  if (component.variantProperties) {
    penpotComponent.variantProperties = component.variantProperties;
  }

  context.addComponent(penpotComponent);
};
