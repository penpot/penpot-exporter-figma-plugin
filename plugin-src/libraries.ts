import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { ComponentProperty } from '@ui/types';

import { RemoteComponentsLibrary } from './RemoteComponents';

export const textStyles: Map<string, TextStyle | undefined> = new Map();
export const paintStyles: Map<string, PaintStyle | undefined> = new Map();
export const overrides: Map<string, NodeChangeProperty[]> = new Map();
export const images: Map<string, Image | null> = new Map();
export const components: Map<string, ComponentShape> = new Map();
export const componentProperties: Map<string, ComponentProperty> = new Map();
export const remoteComponents = new RemoteComponentsLibrary();
