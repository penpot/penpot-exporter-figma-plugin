import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { TypographyStyle } from '@ui/lib/types/shapes/textShape';
import { FillStyle } from '@ui/lib/types/utils/fill';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { ComponentProperty, UiComponent } from '@ui/types';

export const typographies: Map<string, TypographyStyle> = new Map();
export const images: Map<string, Uuid> = new Map();
export const identifiers: Map<string, Uuid> = new Map();
export const components: Map<string, UiComponent> = new Map();
export const componentShapes: Map<string, ComponentShape> = new Map();
export const colors: Map<string, FillStyle> = new Map();
export const componentProperties: Map<string, ComponentProperty> = new Map();
