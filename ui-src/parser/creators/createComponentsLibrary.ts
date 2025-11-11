import { yieldEvery } from '@common/sleep';

import { sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { PenpotComponent } from '@ui/lib/types/shapes/componentShape';
import { componentRoots, components } from '@ui/parser';
import type { UiComponent } from '@ui/types';

export const createComponentsLibrary = async (context: PenpotContext): Promise<void> => {
  let componentsBuilt = 0;

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

    componentsBuilt += 1;

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: componentsBuilt
    });

    await yieldEvery(componentsBuilt);
  }
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
