import { buildTextContent } from '@plugin/translators/text';
import type { TextSegment } from '@plugin/translators/text/paragraph';

import type { TextAttributes, TextShape } from '@ui/lib/types/shapes/textShape';

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
  const segments = injectForcedBreaks(styledTextSegments, forcedLines);

  return {
    characters,
    content: buildTextContent(node.text, segments, 'center', 'center'),
    growType: 'fixed'
  };
};

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
