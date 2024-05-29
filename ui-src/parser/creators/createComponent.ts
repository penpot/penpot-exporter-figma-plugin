import { PenpotFile } from '@ui/lib/types/penpotFile';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { components } from '@ui/parser/libraries';

import { createArtboard } from '.';

export const createComponent = (
  file: PenpotFile,
  { type, path, children = [], ...rest }: ComponentShape
) => {
  const frameId = file.newId();
  const componentId = file.newId();

  const commonStructure = {
    ...rest,
    children,
    componentFile: file.getId(),
    componentId: componentId,
    componentRoot: true,
    mainInstance: true
  };

  createArtboard(file, {
    ...commonStructure,
    id: frameId,
    mainInstance: true,
    type: 'frame'
  });

  components.addComponent({
    ...commonStructure,
    id: componentId,
    mainInstanceId: frameId,
    mainInstancePage: file.getCurrentPageId(),
    path,
    type
  });
};
