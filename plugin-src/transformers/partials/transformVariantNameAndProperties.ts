import { variantProperties } from '@plugin/libraries';

import type { VariantComponent, VariantShape } from '@ui/lib/types/shapes/variant';
import type { Uuid } from '@ui/lib/types/utils/uuid';

type VariantProperty = { name: string; value: string };

const parseNodeName = (nodeName: string): Map<string, string> => {
  const properties = new Map<string, string>();

  for (const pair of nodeName.split(',')) {
    const [name, value] = pair.split('=').map(s => s.trim());
    properties.set(name, value);
  }

  return properties;
};

const getSortedPropertyNames = (
  parsedMap: Map<string, string>,
  registeredNames: Set<string> | undefined
): string[] => {
  const names = registeredNames ?? parsedMap.keys();
  return Array.from(names).sort();
};

const buildVariantName = (parsedMap: Map<string, string>, sortedNames: string[]): string => {
  return sortedNames
    .map(name => parsedMap.get(name))
    .filter((value): value is string => value !== undefined)
    .join(', ');
};

const buildVariantProperties = (
  parsedMap: Map<string, string>,
  sortedNames: string[]
): VariantProperty[] => {
  return sortedNames.map(name => ({
    name,
    value: parsedMap.get(name) ?? ''
  }));
};

export const transformVariantNameAndProperties = (
  node: ComponentNode,
  variantId: Uuid
): Pick<VariantComponent, 'variantProperties'> & Pick<VariantShape, 'variantName'> => {
  const registeredNames = variantProperties.get(variantId);
  const parsedMap = parseNodeName(node.name);
  const sortedNames = getSortedPropertyNames(parsedMap, registeredNames);

  return {
    variantName: buildVariantName(parsedMap, sortedNames),
    variantProperties: buildVariantProperties(parsedMap, sortedNames)
  };
};
