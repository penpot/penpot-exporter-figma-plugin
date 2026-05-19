import { STYLED_TEXT_SEGMENT_FIELDS, buildTextContent } from '@plugin/translators/text';
import type { TextSegment } from '@plugin/translators/text/paragraph';

import type { TextAttributes, TextShape } from '@ui/lib/types/shapes/textShape';

export const translateShapeWithTextContent = (
  node: ShapeWithTextNode,
  forcedLines: string[] = []
): TextAttributes & Pick<TextShape, 'growType'> => {
  const rawSegments = node.text.getStyledTextSegments(STYLED_TEXT_SEGMENT_FIELDS);
  const styledTextSegments = rawSegments.map(normalizeSegment);

  const rawCharacters = forcedLines.length > 1 ? forcedLines.join('\n') : node.text.characters;
  const characters = normalizeNewlines(rawCharacters);
  const segments = injectForcedBreaks(styledTextSegments, forcedLines);

  return {
    characters,
    content: buildTextContent(buildTextContentNode(node), segments, 'center', 'center'),
    growType: 'fixed'
  };
};

// ShapeWithText uses U+2028 / U+2029 for breaks; paragraph engine only splits on `\n`.
const UNICODE_NEWLINES = /[\u2028\u2029]/g;
const normalizeNewlines = (text: string): string => text.replace(UNICODE_NEWLINES, '\n');

// Clear textStyleId: refs an internal style we don't export, would drop decoration/size.
const normalizeSegment = (segment: TextSegment): TextSegment => ({
  ...segment,
  textStyleId: '',
  characters: normalizeNewlines(segment.characters)
});

// Force spacing to 0: non-zero defaults stack extra `\n` per source `\n` in the engine.
type BuildTextContentNode = Parameters<typeof buildTextContent>[0];

const buildTextContentNode = (node: ShapeWithTextNode): BuildTextContentNode =>
  ({
    paragraphIndent: 0,
    paragraphSpacing: 0,
    listSpacing: 0,
    fills: node.text.fills,
    fillStyleId: node.text.fillStyleId
  }) as unknown as BuildTextContentNode;

const injectForcedBreaks = (segments: TextSegment[], forcedLines: string[]): TextSegment[] => {
  if (segments.length === 0 || forcedLines.length <= 1) return segments;

  const sourceCharacters = segments.map(segment => segment.characters).join('');
  const flattenedForcedLines = forcedLines.join('');
  if (sourceCharacters !== flattenedForcedLines) {
    return segments;
  }

  const breakpoints: number[] = [];
  let sourceIndex = 0;
  for (const line of forcedLines.slice(0, -1)) {
    sourceIndex += line.length;
    breakpoints.push(sourceIndex);
  }

  const nextSegments: TextSegment[] = [];
  let sourceOffset = 0;
  let targetOffset = 0;
  let breakpointIndex = 0;

  const pushText = (segment: TextSegment, characters: string): void => {
    if (characters.length === 0) return;
    nextSegments.push({
      ...segment,
      characters,
      start: targetOffset,
      end: targetOffset + characters.length
    });
    targetOffset += characters.length;
  };

  const pushLineBreak = (segment: TextSegment): void => {
    const lastSegment = nextSegments[nextSegments.length - 1];
    if (lastSegment) {
      lastSegment.characters += '\n';
      lastSegment.end += 1;
    } else {
      nextSegments.push({
        ...segment,
        characters: '\n',
        start: targetOffset,
        end: targetOffset + 1
      });
    }
    targetOffset += 1;
    breakpointIndex += 1;
  };

  for (const segment of segments) {
    let localOffset = 0;

    while (true) {
      while (breakpoints[breakpointIndex] === sourceOffset) {
        pushLineBreak(segment);
      }

      if (localOffset >= segment.characters.length) {
        break;
      }

      const nextBreakpoint = breakpoints[breakpointIndex] ?? Infinity;
      const charsToCopy = Math.min(
        segment.characters.length - localOffset,
        nextBreakpoint - sourceOffset
      );
      pushText(segment, segment.characters.slice(localOffset, localOffset + charsToCopy));
      localOffset += charsToCopy;
      sourceOffset += charsToCopy;
    }
  }

  return nextSegments.length > 0 ? nextSegments : segments;
};
