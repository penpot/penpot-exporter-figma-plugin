import type { PenpotPage } from '@ui/lib/types/penpotPage';
import type { TypographyStyle } from '@ui/lib/types/shapes/textShape';
import type { Tokens } from '@ui/lib/types/shapes/tokens';
import type { FillStyle } from '@ui/lib/types/utils/fill';
import type { ComponentProperty, ComponentRoot } from '@ui/types';

export type PenpotDocument = {
  name: string;
  children?: PenpotPage[];
  components: Record<string, ComponentRoot>;
  // Streamed separately as PENPOT_IMAGE messages and attached by the UI before parsing.
  images?: Record<string, Uint8Array<ArrayBuffer>>;
  paintStyles: Record<string, FillStyle>;
  textStyles: Record<string, TypographyStyle>;
  tokens?: Tokens;
  componentProperties: Record<string, ComponentProperty>;
  externalLibraries: Record<string, string>;
  missingFonts: string[];
  isShared: boolean;
};
