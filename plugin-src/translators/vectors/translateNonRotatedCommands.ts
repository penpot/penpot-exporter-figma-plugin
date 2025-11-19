import type { Command } from 'svg-path-parser';

export const translateNonRotatedCommands = (
  commands: Command[],
  baseX: number = 0,
  baseY: number = 0
): string => {
  return commands
    .reduce((svgPath, command) => {
      const pathString = translateCommandToPathString(applyBase(command, baseX, baseY));

      return svgPath + pathString + ' ';
    }, '')
    .trimEnd();
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

export const applyBase = (command: Command, baseX: number, baseY: number): Command => {
  switch (command.command) {
    case 'lineto':
    case 'moveto':
      return {
        ...command,
        x: command.x + baseX,
        y: command.y + baseY
      };
    case 'curveto':
      return {
        ...command,
        x1: command.x1 + baseX,
        y1: command.y1 + baseY,
        x2: command.x2 + baseX,
        y2: command.y2 + baseY,
        x: command.x + baseX,
        y: command.y + baseY
      };
    default:
      return command;
  }
};
