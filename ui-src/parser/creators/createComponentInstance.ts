import { PenpotFile } from '@ui/lib/types/penpotFile';
import { uiComponents } from '@ui/parser/libraries';
import { ComponentInstance } from '@ui/types';

import { createArtboard } from '.';

export const createComponentInstance = (
  file: PenpotFile,
  { type, figmaId, ...rest }: ComponentInstance
) => {
  const uiComponent = uiComponents.get(figmaId);
  if (!uiComponent) {
    return;
  }

  createArtboard(file, {
    ...rest,
    componentFile: file.getId(),
    componentId: uiComponent.componentId,
    componentRoot: true,
    mainInstance: false,
    type: 'frame'
  });
};
