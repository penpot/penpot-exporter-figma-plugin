import { PenpotPage } from '@ui/lib/types/penpotPage';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';

export type PenpotDocument = {
  name: string;
  children?: PenpotPage[];
  components: Record<string, ComponentShape>;
  images: Record<string, Uint8Array>;
};
