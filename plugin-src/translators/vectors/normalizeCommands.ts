import { type Command, makeAbsolute } from 'svg-path-parser';

type CubicControls = { x1: number; y1: number; x2: number; y2: number; x: number; y: number };

const cubic = (controls: CubicControls): Command => ({
  command: 'curveto',
  code: 'C',
  relative: false,
  ...controls
});

const quadToCubic = (
  x0: number,
  y0: number,
  qx: number,
  qy: number,
  x: number,
  y: number
): CubicControls => ({
  x1: x0 + (2 / 3) * (qx - x0),
  y1: y0 + (2 / 3) * (qy - y0),
  x2: x + (2 / 3) * (qx - x),
  y2: y + (2 / 3) * (qy - y),
  x,
  y
});

const reflect = (
  origin: { x: number; y: number },
  point: { x: number; y: number } | null
): { x: number; y: number } =>
  point ? { x: 2 * origin.x - point.x, y: 2 * origin.y - point.y } : { ...origin };

export const normalizeCommands = (commands: Command[]): Command[] => {
  const out: Command[] = [];
  // SVG spec: smooth-curve reflection assumes current point unless the previous
  // command was a matching curve — null these on any other command.
  let lastCubicControl: { x: number; y: number } | null = null;
  let lastQuadControl: { x: number; y: number } | null = null;

  for (const c of makeAbsolute(commands)) {
    switch (c.command) {
      case 'moveto':
        out.push({ command: 'moveto', code: 'M', relative: false, x: c.x, y: c.y });
        lastCubicControl = lastQuadControl = null;
        break;

      case 'lineto':
      case 'horizontal lineto':
      case 'vertical lineto':
        out.push({ command: 'lineto', code: 'L', relative: false, x: c.x, y: c.y });
        lastCubicControl = lastQuadControl = null;
        break;

      case 'closepath':
        out.push({ command: 'closepath', code: 'Z', relative: false });
        lastCubicControl = lastQuadControl = null;
        break;

      case 'curveto':
        out.push(cubic({ x1: c.x1, y1: c.y1, x2: c.x2, y2: c.y2, x: c.x, y: c.y }));
        lastCubicControl = { x: c.x2, y: c.y2 };
        lastQuadControl = null;
        break;

      case 'smooth curveto': {
        const c1 = reflect({ x: c.x0, y: c.y0 }, lastCubicControl);
        out.push(cubic({ x1: c1.x, y1: c1.y, x2: c.x2, y2: c.y2, x: c.x, y: c.y }));
        lastCubicControl = { x: c.x2, y: c.y2 };
        lastQuadControl = null;
        break;
      }

      case 'quadratic curveto':
        out.push(cubic(quadToCubic(c.x0, c.y0, c.x1, c.y1, c.x, c.y)));
        lastCubicControl = null;
        lastQuadControl = { x: c.x1, y: c.y1 };
        break;

      case 'smooth quadratic curveto': {
        const q = reflect({ x: c.x0, y: c.y0 }, lastQuadControl);
        out.push(cubic(quadToCubic(c.x0, c.y0, q.x, q.y, c.x, c.y)));
        lastCubicControl = null;
        lastQuadControl = q;
        break;
      }

      case 'elliptical arc':
        // No current Figma ShapeWithText emits arcs; degrade + warn so a
        // future regression is visible instead of silently lost.
        console.warn('normalizeCommands: elliptical arc degraded to lineto', {
          x: c.x,
          y: c.y
        });
        out.push({ command: 'lineto', code: 'L', relative: false, x: c.x, y: c.y });
        lastCubicControl = lastQuadControl = null;
        break;
    }
  }

  return out;
};
