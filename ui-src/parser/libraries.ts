import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { TypographyStyle } from '@ui/lib/types/shapes/textShape';
import { FillStyle } from '@ui/lib/types/utils/fill';
import { ImageColor } from '@ui/lib/types/utils/imageColor';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type UiComponent = {
  componentId: Uuid;
  mainInstancePage?: Uuid;
  mainInstanceId: Uuid;
  componentFigmaId: string;
};

export const init = <T>(records: Record<string, T>, map: Map<string, T>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map = new Map(Object.entries(records));
};

export const typographies: Map<string, TypographyStyle> = new Map();
export const images: Map<string, ImageColor> = new Map();
export const identifiers: Map<string, Uuid> = new Map();
export const components: Map<string, UiComponent> = new Map();
export const componentShapes: Map<string, ComponentShape> = new Map();
export const colors: Map<string, FillStyle> = new Map();
