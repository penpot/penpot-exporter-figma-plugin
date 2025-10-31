import { variables } from '@plugin/libraries';

import type { TokenProperties } from '@ui/lib/types/shapes/tokens';

const equivalences = [
  // Color
  { variable: 'fills', token: 'fill', type: 'color' },

  // Number
  { variable: 'opacity', token: 'opacity', type: 'opacity' },
  { variable: 'topLeftRadius', token: 'r1', type: 'borderRadius' },
  { variable: 'topRightRadius', token: 'r2', type: 'borderRadius' },
  { variable: 'bottomRightRadius', token: 'r3', type: 'borderRadius' },
  { variable: 'bottomLeftRadius', token: 'r4', type: 'borderRadius' },
  { variable: 'itemSpacing', token: 'rowGap', type: 'spacing' },
  { variable: 'itemSpacing', token: 'columnGap', type: 'spacing' },
  { variable: 'width', token: 'width', type: 'sizing' },
  { variable: 'height', token: 'height', type: 'sizing' },
  { variable: 'paddingTop', token: 'p1', type: 'spacing' },
  { variable: 'paddingRight', token: 'p2', type: 'spacing' },
  { variable: 'paddingBottom', token: 'p3', type: 'spacing' },
  { variable: 'paddingLeft', token: 'p4', type: 'spacing' },
  { variable: 'strokes', token: 'strokeColor', type: 'color' }
] as const;

const getBoundVariableIdForPaint = (paints: readonly Paint[]): string | null => {
  const paint = paints[paints.length - 1];

  if (paint.type !== 'SOLID') {
    return null;
  }

  return paint.boundVariables?.color?.id ?? null;
};

const getBoundVariableId = (
  boundVariable: VariableAlias | VariableAlias[],
  variableType: string,
  node: SceneNode
): string | null => {
  if (!Array.isArray(boundVariable)) {
    return boundVariable.id;
  }

  if (variableType === 'fills' && 'fills' in node && figma.mixed !== node.fills) {
    return getBoundVariableIdForPaint(node.fills);
  }

  if (variableType === 'strokes' && 'strokes' in node) {
    return getBoundVariableIdForPaint(node.strokes);
  }

  return null;
};

export const translateAppliedTokens = (
  boundVariables: SceneNodeMixin['boundVariables'],
  node: SceneNode
): { [key in TokenProperties]?: string } => {
  if (!boundVariables) return {};

  const appliedTokens: { [key in TokenProperties]?: string } = {};

  for (const equivalence of equivalences) {
    const boundVariable = boundVariables[equivalence.variable];

    if (!boundVariable) continue;

    const boundVariableId = getBoundVariableId(boundVariable, equivalence.variable, node);
    if (!boundVariableId) continue;

    const variable = variables.get(`${boundVariableId}.${equivalence.type}`);

    if (variable) {
      appliedTokens[equivalence.token] = variable;
    }
  }

  return appliedTokens;
};
