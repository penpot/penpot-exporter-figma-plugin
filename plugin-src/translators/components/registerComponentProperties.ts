import { componentProperties } from '@plugin/libraries';

import type { ComponentProperty } from '@ui/types';

export const registerComponentProperties = (node: ComponentSetNode | ComponentNode): void => {
  try {
    Object.entries(node.componentPropertyDefinitions).forEach(([key, value]) => {
      if (value.type === 'TEXT' || value.type === 'BOOLEAN') {
        componentProperties.set(key, value as ComponentProperty);
      }
    });
  } catch (error) {
    console.warn('Could not register component properties', node.name, error);
  }
};
