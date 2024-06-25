import { imagesLibrary } from '@plugin/libraries';
import { sleep } from '@plugin/utils';

export const processImages = async (): Promise<Record<string, Uint8Array>> => {
  const imageToDownload = Object.entries(imagesLibrary.all());
  const images: Record<string, Uint8Array> = {};

  if (imageToDownload.length === 0) return images;

  let currentImage = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: imageToDownload.length
  });

  figma.ui.postMessage({
    type: 'PROGRESS_STEP',
    data: 'images'
  });

  for (const [key, image] of imageToDownload) {
    const bytes = await image?.getBytesAsync();

    if (bytes) {
      images[key] = bytes;
    }

    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentImage++
    });

    await sleep(0);
  }

  await sleep(20);

  return images;
};
