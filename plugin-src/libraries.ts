import type { Uuid } from '@ui/lib/types/utils/uuid';
import type { ComponentProperty, ComponentRoot } from '@ui/types';

export const identifiers: Map<string, Uuid> = new Map();
export const missingFonts: Set<string> = new Set();
export const textStyles: Map<string, TextStyle | undefined> = new Map();
export const paintStyles: Map<string, PaintStyle | undefined> = new Map();
export const overrides: Map<string, NodeChangeProperty[]> = new Map();
export const images: Map<string, Image | null> = new Map();
export const components: Map<Uuid, ComponentRoot> = new Map();
export const componentProperties: Map<string, ComponentProperty> = new Map();
export const variantProperties: Map<Uuid, Set<string>> = new Map();
export const variables: Map<string, string> = new Map();
export const variableNames: Map<string, string> = new Map();
export const uniqueVariableNames: Set<string> = new Set();
export const externalLibraries: Map<string, string> = new Map();
