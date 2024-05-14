import { PenpotFile } from '@ui/lib/types/penpotFile';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';

import { createPenpotArtboard, createPenpotItem } from '.';

export const createPenpotComponent = (
  file: PenpotFile,
  { type, children = [], ...rest }: ComponentShape
) => {
  const frameId = createPenpotArtboard(file, {
    type: 'frame',
    children,
    ...rest
  });

  const componentId = file.startComponent({
    ...rest,
    componentFile: file.getId(),
    mainInstancePage: file.getCurrentPageId(),
    mainInstanceId: frameId
  });

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.finishComponent();

  const newRest = {
    componentRoot: true,
    componentId: componentId,
    componentFile: file.getId(),
    mainInstance: true
  };

  file.updateObject(frameId, newRest);
};
