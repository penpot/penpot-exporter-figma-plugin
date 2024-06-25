import { PenpotPage } from '@ui/lib/types/penpotPage';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { TypographyStyle } from '@ui/lib/types/shapes/textShape';
import { FillStyle } from '@ui/lib/types/utils/fill';

export type PenpotDocument = {
  name: string;
  children?: PenpotPage[];
  components: Record<string, ComponentShape>;
  images: Record<string, Uint8Array>;
  paintStyles: Record<string, FillStyle>;
  textStyles: Record<string, TypographyStyle>;
};
