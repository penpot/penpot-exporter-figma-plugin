import type { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import type { ComponentProperty } from '@ui/types';

export const textStyles: Map<string, TextStyle | undefined> = new Map();
export const paintStyles: Map<string, PaintStyle | undefined> = new Map();
export const overrides: Map<string, NodeChangeProperty[]> = new Map();
export const images: Map<string, Image | null> = new Map();
export const components: Map<string, ComponentShape> = new Map();
export const componentProperties: Map<string, ComponentProperty> = new Map();
export const variantProperties: Map<string, Set<string>> = new Map();
export const variables: Map<string, string> = new Map();
export const variableNames: Map<string, string> = new Map();
export const uniqueVariableNames: Set<string> = new Set();
