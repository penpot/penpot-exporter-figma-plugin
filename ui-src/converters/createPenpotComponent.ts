import { components } from '@ui/converters/Components';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';

import { createPenpotArtboard } from '.';

export const createPenpotComponent = (
  file: PenpotFile,
  { type, children = [], ...rest }: ComponentShape
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

  createPenpotArtboard(file, {
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
    type
  });
};
