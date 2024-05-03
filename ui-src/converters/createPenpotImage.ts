import { PenpotFile } from '@ui/lib/penpot';
import { ImageShape } from '@ui/lib/types/shapes/imageShape';

export const createPenpotImage = (file: PenpotFile, { type, ...rest }: ImageShape) => {
  file.createImage(rest);
};
