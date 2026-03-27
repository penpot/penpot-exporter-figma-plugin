import { styleTokenNames, variables } from '@plugin/libraries';

import type { TokenProperties } from '@ui/lib/types/shapes/tokens';

const EQUIVALENCIES = [
  // Color
  { figma: 'fills', penpot: 'fill', tokenType: 'color' },
  { figma: 'strokes', penpot: 'strokeColor', tokenType: 'color' },

  // Number
  { figma: 'opacity', penpot: 'opacity', tokenType: 'opacity' },
  { figma: 'topLeftRadius', penpot: 'r1', tokenType: 'borderRadius' },
  { figma: 'topRightRadius', penpot: 'r2', tokenType: 'borderRadius' },
  { figma: 'bottomRightRadius', penpot: 'r3', tokenType: 'borderRadius' },
  { figma: 'bottomLeftRadius', penpot: 'r4', tokenType: 'borderRadius' },
  { figma: 'itemSpacing', penpot: 'rowGap', tokenType: 'spacing' },
  { figma: 'itemSpacing', penpot: 'columnGap', tokenType: 'spacing' },
  { figma: 'width', penpot: 'width', tokenType: 'sizing' },
  { figma: 'height', penpot: 'height', tokenType: 'sizing' },
  { figma: 'paddingTop', penpot: 'p1', tokenType: 'spacing' },
  { figma: 'paddingRight', penpot: 'p2', tokenType: 'spacing' },
  { figma: 'paddingBottom', penpot: 'p3', tokenType: 'spacing' },
  { figma: 'paddingLeft', penpot: 'p4', tokenType: 'spacing' },
  { figma: 'letterSpacing', penpot: 'letterSpacing', tokenType: 'letterSpacing' },
  { figma: 'fontSize', penpot: 'fontSize', tokenType: 'fontSizes' },
  { figma: 'strokeTopWeight', penpot: 'strokeWidth', tokenType: 'borderWidth' },

  // Text
  { figma: 'fontFamily', penpot: 'fontFamily', tokenType: 'fontFamilies' },

  // Number & Text
  { figma: 'fontWeight', penpot: 'fontWeight', tokenType: 'fontWeights' }
] as const;

const getBoundVariableIdForPaint = (paints: readonly Paint[]): string | null => {
  if (paints.length === 0) {
    return null;
  }

  const paint = paints[paints.length - 1];

  if (paint.type !== 'SOLID') {
    return null;
  }

  return paint.boundVariables?.color?.id ?? null;
};

const isTextNode = (node: SceneNode): node is TextNode => {
  return node.type === 'TEXT';
};

const getBoundVariableId = (
  boundVariable: VariableAlias | VariableAlias[],
  variableType: string,
  node: SceneNode
): string | null => {
  if (!Array.isArray(boundVariable)) {
    // Figma exposes strokeTopWeight, strokeRightWeight,
    // strokeBottomWeight, and strokeLeftWeight but Penpot only supports strokeWidth.
    // If the strokeWeight is mixed, we will not assign an applied token.
    if (
      variableType === 'strokeTopWeight' &&
      'strokeWeight' in node &&
      figma.mixed === node.strokeWeight
    ) {
      return null;
    }

    return boundVariable.id;
  }

  if (boundVariable.length === 0) {
    return null;
  }

  if (variableType === 'fills' && 'fills' in node && figma.mixed !== node.fills) {
    return getBoundVariableIdForPaint(node.fills);
  }

  if (variableType === 'strokes' && 'strokes' in node) {
    return getBoundVariableIdForPaint(node.strokes);
  }

  if (isTextNode(node)) {
    switch (variableType) {
      case 'letterSpacing':
        if (figma.mixed !== node.letterSpacing) {
          return boundVariable[0].id;
        }

        return null;
      case 'fontSize':
        if (figma.mixed !== node.fontSize) {
          return boundVariable[0].id;
        }

        return null;

      case 'fontWeight':
        if (figma.mixed !== node.fontWeight) {
          return boundVariable[0].id;
        }

        return null;
      case 'fontFamily':
        if (figma.mixed !== node.fontName) {
          return boundVariable[0].id;
        }

        return null;
      default:
        return null;
    }
  }

  return null;
};

export const translateAppliedTokens = (
  boundVariables: SceneNodeMixin['boundVariables'],
  node: SceneNode
): { [key in TokenProperties]?: string } => {
  if (!boundVariables) return {};

  const appliedTokens: { [key in TokenProperties]?: string } = {};

  for (const equivalence of EQUIVALENCIES) {
    const boundVariable = boundVariables[equivalence.figma];

    if (!boundVariable) continue;

    const boundVariableId = getBoundVariableId(boundVariable, equivalence.figma, node);
    if (!boundVariableId) continue;

    const variable = variables.get(`${boundVariableId}.${equivalence.tokenType}`);

    if (variable) {
      appliedTokens[equivalence.penpot] = variable;
    }
  }

  return appliedTokens;
};

export const translateAppliedStyleTokens = (
  node: SceneNode
): { [key in TokenProperties]?: string } => {
  const appliedTokens: { [key in TokenProperties]?: string } = {};

  if ('effectStyleId' in node && node.effectStyleId && node.effectStyleId.length > 0) {
    const tokenName = styleTokenNames.get(node.effectStyleId as string);

    if (tokenName) {
      appliedTokens.shadow = tokenName;
    }
  }

  return appliedTokens;
};
