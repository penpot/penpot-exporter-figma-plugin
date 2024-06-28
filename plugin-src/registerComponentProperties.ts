import { componentProperties } from '@plugin/libraries';

export const registerComponentProperties = (node: ComponentSetNode | ComponentNode) => {
  try {
    Object.entries(node.componentPropertyDefinitions).forEach(([key, value]) => {
      if (value.type === 'TEXT' || value.type === 'BOOLEAN') {
        componentProperties.set(key, value);
      }
    });
  } catch (error) {
    console.error('Error registering component properties', node, error);
  }
};
