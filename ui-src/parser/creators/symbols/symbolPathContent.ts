import {
  Command,
  PathContent,
  VECTOR_CLOSE_PATH,
  VECTOR_CURVE_TO,
  VECTOR_LINE_TO,
  VECTOR_MOVE_TO
} from '@ui/lib/types/shapes/pathShape';

export const symbolPathContent = (content: PathContent): PathContent =>
  content.map(segment => {
    segment.command = symbolPathCommand(segment.command);

    return segment;
  });

const symbolPathCommand = (command: Command): Command => {
  if (typeof command !== 'string') return command;

  switch (command) {
    case 'line-to':
      return VECTOR_LINE_TO;
    case 'close-path':
      return VECTOR_CLOSE_PATH;
    case 'move-to':
      return VECTOR_MOVE_TO;
    case 'curve-to':
      return VECTOR_CURVE_TO;
  }
};
