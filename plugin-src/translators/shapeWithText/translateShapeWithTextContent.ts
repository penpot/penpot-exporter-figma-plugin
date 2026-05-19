import { buildTextContent } from '@plugin/translators/text';
import type { TextSegment } from '@plugin/translators/text/paragraph';

import type { TextAttributes, TextShape } from '@ui/lib/types/shapes/textShape';

// TextSublayerNode exposes no align/autoresize; Figma always renders SWT
// center/center/fixed, so hardcode. `forcedLines` injects `\n` breaks so
// Penpot wraps where Figma did instead of using its own glyph metrics.
export const translateShapeWithTextContent = (
  node: ShapeWithTextNode,
  forcedLines: string[] = []
): TextAttributes & Pick<TextShape, 'growType'> => {
  const styledTextSegments = node.text.getStyledTextSegments([
    'fontName',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'textCase',
    'textDecoration',
    'indentation',
    'listOptions',
    'fills',
    'fillStyleId',
    'textStyleId'
  ]);

  const characters = forcedLines.length > 1 ? forcedLines.join('\n') : node.text.characters;
  const segments = withForcedBreaks(styledTextSegments, forcedLines);

  return {
    characters,
    content: buildTextContent(node.text, segments, 'center', 'center'),
    growType: 'fixed'
  };
};

// Collapses to the first segment's style — multi-style SWT labels are rare.
const withForcedBreaks = (segments: TextSegment[], forcedLines: string[]): TextSegment[] => {
  if (segments.length === 0 || forcedLines.length <= 1) return segments;
  const joined = forcedLines.join('\n');
  const head = segments[0];
  return [
    {
      ...head,
      characters: joined,
      start: head.start,
      end: head.start + joined.length
    }
  ];
};
