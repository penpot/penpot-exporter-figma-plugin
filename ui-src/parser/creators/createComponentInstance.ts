import { PenpotFile } from '@ui/lib/types/penpotFile';
import { InstanceShape } from '@ui/lib/types/shapes/instanceShape';

export const createComponentInstance = (file: PenpotFile, { type, ...rest }: InstanceShape) => {
  console.log(file.createComponentInstance({ ...rest }));
};
