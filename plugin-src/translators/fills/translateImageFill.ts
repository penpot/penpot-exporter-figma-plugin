import { detectMimeType } from '@plugin/utils';

import { Fill } from '@ui/lib/types/utils/fill';
import { ImageColor } from '@ui/lib/types/utils/imageColor';

export const translateImageFill = async (fill: ImagePaint): Promise<Fill | undefined> => {
  const fillImage = await translateImage(fill.imageHash);
  if (!fillImage) return;

  return {
    fillOpacity: !fill.visible ? 0 : fill.opacity,
    fillImage: fillImage
  };
};

const translateImage = async (imageHash: string | null): Promise<ImageColor | undefined> => {
  if (!imageHash) return;

  const image = figma.getImageByHash(imageHash);
  if (!image) return;

  const bytes = await image.getBytesAsync();
  const size = await image.getSizeAsync();
  const b64 = figma.base64Encode(bytes);
  const mimeType = detectMimeType(b64);
  const dataUri = `data:${mimeType};base64,${b64}`;

  return {
    width: size.width,
    height: size.height,
    mtype: mimeType,
    keepAspectRatio: true,
    dataUri: dataUri,
    id: '00000000-0000-0000-0000-000000000000'
  };
};
