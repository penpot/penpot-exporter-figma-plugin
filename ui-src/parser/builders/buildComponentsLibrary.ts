import { yieldByTime } from '@common/sleep';

import { flushMessageQueue, sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { PenpotComponent } from '@ui/lib/types/shapes/componentShape';
import { componentRoots, components } from '@ui/parser';
import type { UiComponent } from '@ui/types';

export const buildComponentsLibrary = async (context: PenpotContext): Promise<void> => {
  let componentsBuilt = 1;

  sendMessage({
    type: 'PROGRESS_STEP',
    data: {
      step: 'components',
      total: components.size
    }
  });

  for (const [_, component] of components.entries()) {
    createComponentLibrary(context, component);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: componentsBuilt++
    });

    await yieldByTime();
  }

  flushMessageQueue();
};

const createComponentLibrary = (context: PenpotContext, component: UiComponent): void => {
  const componentRoot = componentRoots.get(component.frameId);

  if (!componentRoot) {
    return;
  }

  const penpotComponent: PenpotComponent = {
    componentId: component.componentId,
    fileId: context.currentFileId,
    name: component.name,
    frameId: component.frameId,
    pageId: component.pageId,
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
