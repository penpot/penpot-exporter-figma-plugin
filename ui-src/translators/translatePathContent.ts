import {
  Command,
  PathContent,
  Segment,
  VECTOR_CLOSE_PATH,
  VECTOR_CURVE_TO,
  VECTOR_LINE_TO,
  VECTOR_MOVE_TO
} from '@ui/lib/types/path/PathContent';

export const translatePathContent = (content: PathContent): PathContent =>
  content
    .map(({ command: stringCommand, ...rest }) => {
      const command = translatePathCommand(stringCommand);

      if (!command) return null;

      return {
        command,
        ...rest
      } as Segment;
    })
    .filter((command): command is Segment => !!command);

const translatePathCommand = (command: Command): Command | undefined => {
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

  console.error(`Unsupported svg command type: ${String(command)}`);
};
