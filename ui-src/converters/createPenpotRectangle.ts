import { PenpotFile } from '@ui/lib/penpot';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { Fill } from '@ui/lib/types/utils/fill';
import { translateFillGradients, translateUiBlendMode } from '@ui/translators';

export const createPenpotRectangle = (
  file: PenpotFile,
  { type, fills, blendMode, ...rest }: RectShape
) => {
  file.createRect({
    fills: translateFills(file, fills),
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });
};

const translateFills = (file: PenpotFile, fills: Fill[] | undefined): Fill[] => {
  const finalFills = translateFillGradients(fills) ?? [];

  return finalFills.map(fill => {
    if (fill.fillImage) {
      const id = file.addLibraryMedia({
        name: 'image.png',
        mtype: 'image/png',
        width: 500,
        height: 500,
        path: '',
        uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC'
      });

      console.log({
        fillOpacity: fill.fillOpacity,
        fillImage: {
          ...fill.fillImage,
          opacity: 1,
          id: id
        }
      });

      return {
        fillOpacity: fill.fillOpacity,
        fillImage: {
          ...fill.fillImage,
          keepAspectRatio: true,
          opacity: 1,
          id: id
        }
      };
    }

    return fill;
  });
};
