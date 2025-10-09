import type { PenpotPage } from '@ui/lib/types/penpotPage';
import type { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import type { TypographyStyle } from '@ui/lib/types/shapes/textShape';
import type { VariantProperty } from '@ui/lib/types/shapes/variant';
import type { FillStyle } from '@ui/lib/types/utils/fill';
import type { ComponentProperty } from '@ui/types/component';

export type PenpotDocument = {
  name: string;
  children?: PenpotPage[];
  components: Record<string, ComponentShape>;
  images: Record<string, Uint8Array<ArrayBuffer>>;
  paintStyles: Record<string, FillStyle>;
  textStyles: Record<string, TypographyStyle>;
  componentProperties: Record<string, ComponentProperty>;
  variantProperties: Record<string, VariantProperty>;
};
