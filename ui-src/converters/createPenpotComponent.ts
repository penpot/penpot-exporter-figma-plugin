import { PenpotFile } from '@ui/lib/types/penpotFile';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';

import { createPenpotArtboard, createPenpotItem } from '.';

export const createPenpotComponent = (
  file: PenpotFile,
  { type, children = [], ...rest }: ComponentShape
) => {

  const frameId = file.newId();
  const componentId = file.newId();

  const _frameId = createPenpotArtboard(file, {
    id: frameId,
    type: 'frame',
    children,
    componentFile: file.getId(),
    componentId: componentId,
    componentRoot: true,
    mainInstance: true,
    ...rest,
  });

  const _componentId = file.startComponent({
    ...rest,
    id: componentId,
    componentFile: file.getId(),
    componentId: componentId,
    mainInstancePage: file.getCurrentPageId(),
    mainInstanceId: frameId,
    componentRoot: true,
    mainInstance: true,
  });

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.finishComponent();
};
