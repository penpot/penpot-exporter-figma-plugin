import type { PenpotComponent } from '@ui/lib/types/shapes/componentShape';
import type { TypographyStyle } from '@ui/lib/types/shapes/textShape';
import type { FillStyle } from '@ui/lib/types/utils/fill';
import type { Uuid } from '@ui/lib/types/utils/uuid';
import type { ComponentProperty, ComponentRoot } from '@ui/types';

export const typographies: Map<string, TypographyStyle> = new Map();
export const images: Map<string, Uuid> = new Map();
export const components: Map<Uuid, PenpotComponent> = new Map();
export const componentRoots: Map<Uuid, ComponentRoot> = new Map();
export const colors: Map<string, FillStyle> = new Map();
export const componentProperties: Map<string, ComponentProperty> = new Map();
