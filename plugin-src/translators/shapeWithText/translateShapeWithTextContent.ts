import { buildTextContent } from '@plugin/translators/text';
import type { TextSegment } from '@plugin/translators/text/paragraph';

import type { TextAttributes, TextShape } from '@ui/lib/types/shapes/textShape';

// ShapeWithTextNode embeds text via TextSublayerNode, which does not expose
// textAlignHorizontal / textAlignVertical / textAutoResize. Figma renders these
// shapes with center/center alignment and a fixed size matched to the shape,
// so we hardcode those defaults.
//
// `forcedLines` (when 2+ entries) is the list of `<tspan>` text contents
// derived from the editable SVG export. Joining them with `\n` and using that
// as the text content makes Penpot wrap at the same positions as Figma instead
// of inferring breaks from its own glyph metrics. When there's a single line
// (or the lines couldn't be extracted), we fall back to the original
// `node.text.characters` and let Penpot's wrap engine handle it.
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
    growType: 'auto-width'
  };
};

// Replaces the first segment's characters with the forced-break version and
// drops any subsequent segments. SWT labels are typically uniformly styled, so
// this is acceptable; preserving per-segment styling across forced breaks
// would require splitting segments at the boundary offsets, which is overkill
// for a feature where Figma's plugin API doesn't expose per-line alignment in
// the first place.
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
