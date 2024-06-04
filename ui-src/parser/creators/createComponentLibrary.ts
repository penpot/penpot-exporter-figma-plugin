import { componentsLibrary } from '@plugin/ComponentLibrary';
import { remoteComponentsLibrary } from '@plugin/RemoteComponentLibrary';

import { PenpotFile } from '@ui/lib/types/penpotFile';
import { symbolBlendMode, symbolFills } from '@ui/parser/creators/symbols';
import { remoteUiComponents, uiComponents } from '@ui/parser/libraries';

import { createItems } from '.';

export const createComponentLibrary = (file: PenpotFile, remote: boolean = false) => {
  const uiLibrary = remote ? remoteUiComponents : uiComponents;
  const library = remote ? remoteComponentsLibrary : componentsLibrary;

  uiLibrary.all().forEach(uiComponent => {
    const component = library.get(uiComponent.componentFigmaId);
    if (!component || component.type !== 'component') {
      return;
    }

    const { children = [], fills, blendMode, ...rest } = component;

    file.startComponent({
      ...rest,
      fills: symbolFills(fills),
      blendMode: symbolBlendMode(blendMode),
      id: uiComponent.componentId,
      componentId: uiComponent.componentId,
      mainInstancePage: uiComponent.mainInstancePage,
      mainInstanceId: uiComponent.mainInstanceId,
      componentRoot: true,
      mainInstance: true,
      componentFile: file.getId()
    });

    createItems(file, children, remote);

    file.finishComponent();
  });
};
