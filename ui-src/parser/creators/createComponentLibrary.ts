import { componentsLibrary } from '@plugin/ComponentLibrary';

import { PenpotFile } from '@ui/lib/types/penpotFile';
import { uiComponents } from '@ui/parser/libraries';

import { createItems } from '.';

export const createComponentLibrary = (file: PenpotFile) => {
  uiComponents.all().forEach(uiComponent => {
    const component = componentsLibrary.get(uiComponent.componentFigmaId);
    if (!component) {
      return;
    }

    const { children = [], ...rest } = component;

    file.startComponent({
      ...rest,
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
  });
};
