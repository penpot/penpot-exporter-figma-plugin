import { PenpotFile } from '@ui/lib/penpot';
import { IMAGE_TYPE } from '@ui/lib/types/image/imageAttributes';
import { ImageShape } from '@ui/lib/types/image/imageShape';

export const createPenpotImage = (file: PenpotFile, { type, ...rest }: ImageShape) => {
  file.createImage({
    type: IMAGE_TYPE,
    ...rest
  });
};
