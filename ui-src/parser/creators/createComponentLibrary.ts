import { componentsLibrary } from '@plugin/ComponentLibrary';

import { PenpotFile } from '@ui/lib/types/penpotFile';
import { symbolBlendMode, symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';
import { uiComponents } from '@ui/parser/libraries';

import { createItems } from '.';

export const createComponentLibrary = (file: PenpotFile) => {
  uiComponents.all().forEach(uiComponent => {
    const component = componentsLibrary.get(uiComponent.componentFigmaId);
    if (!component) {
      return;
    }

    const { children = [], fills, strokes, 'blend-mode': blendMode, ...rest } = component;

    file.startComponent({
      ...rest,
      'fills': symbolFills(fills),
      'strokes': symbolStrokes(strokes),
      'blend-mode': symbolBlendMode(blendMode),
      'id': uiComponent.componentId,
      'component-id': uiComponent.componentId,
      'main-instance-page': uiComponent.mainInstancePage,
      'main-instance-id': uiComponent.mainInstanceId,
      'component-root': true,
      'main-instance': true,
      'component-file': file.getId()
    });

    createItems(file, children);

    file.finishComponent();
  });
};
