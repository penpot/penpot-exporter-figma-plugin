import { images } from '@plugin/libraries';

import type { Fill } from '@ui/lib/types/utils/fill';

const RASTER_SCALE = 2;

// Rasterizes any exportable Figma node into a PNG and registers it under a hash
// so the rest of the export pipeline (processImages → optimizeFileMedias) can
// pick it up. Used as a fallback for node types Penpot doesn't model natively.
export const translateNodeAsImageFill = async (
  node: ExportMixin & { name: string }
): Promise<Fill | undefined> => {
  try {
    const bytes = await node.exportAsync({
      format: 'PNG',
      constraint: { type: 'SCALE', value: RASTER_SCALE }
    });

    const image = figma.createImage(bytes);
    images.set(image.hash, image);

    return {
      fillOpacity: 1,
      fillImage: { imageHash: image.hash }
    };
  } catch (error) {
    console.warn(`Failed to rasterize node "${node.name}":`, error);
    return undefined;
  }
};
