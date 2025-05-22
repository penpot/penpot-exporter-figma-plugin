import { Command, CurveToCommand, LineToCommand, MoveToCommand } from 'svg-path-parser';

export const translateNonRotatedCommands = (
  commands: Command[],
  baseX: number = 0,
  baseY: number = 0
): string => {
  return translateCommandsToPathString(
    commands.map(command => translateNonRotatedCommand(command, baseX, baseY))
  );
};

export const translateCommandToPathString = (command: Command): string => {
  switch (command.command) {
    case 'moveto':
      return `M ${command.x} ${command.y}`;
    case 'lineto':
      return `L ${command.x} ${command.y}`;
    case 'curveto':
      return `C ${command.x1} ${command.y1}, ${command.x2} ${command.y2}, ${command.x} ${command.y}`;
    case 'closepath':
      return 'Z';
    default:
      return '';
  }
};

export const translateCommandsToPathString = (commands: Command[]): string => {
  return commands.map(translateCommandToPathString).join(' ');
};

export const translateNonRotatedCommand = (
  command: Command,
  baseX: number,
  baseY: number
): Command => {
  switch (command.command) {
    case 'moveto':
      return translateMoveTo(command, baseX, baseY);
    case 'lineto':
      return translateLineTo(command, baseX, baseY);
    case 'curveto':
      return translateCurveTo(command, baseX, baseY);
    case 'closepath':
    default:
      return {
        code: 'Z',
        command: 'closepath'
      };
  }
};

const translateMoveTo = (command: MoveToCommand, baseX: number, baseY: number): Command => {
  return {
    ...command,
    x: command.x + baseX,
    y: command.y + baseY
  };
};

const translateLineTo = (command: LineToCommand, baseX: number, baseY: number): Command => {
  return {
    ...command,
    x: command.x + baseX,
    y: command.y + baseY
  };
};

const translateCurveTo = (command: CurveToCommand, baseX: number, baseY: number): Command => {
  return {
    ...command,
    x1: command.x1 + baseX,
    y1: command.y1 + baseY,
    x2: command.x2 + baseX,
    y2: command.y2 + baseY,
    x: command.x + baseX,
    y: command.y + baseY
  };
};
