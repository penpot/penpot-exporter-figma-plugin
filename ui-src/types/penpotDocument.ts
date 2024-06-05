import { PenpotPage } from '@ui/lib/types/penpotPage';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { ImageColor } from '@ui/lib/types/utils/imageColor';

export type PenpotDocument = {
  name: string;
  children?: PenpotPage[];
  components: Record<string, ComponentShape>;
  remoteComponents: Record<string, ComponentShape | FrameShape>;
  images: Record<string, ImageColor>;
};
