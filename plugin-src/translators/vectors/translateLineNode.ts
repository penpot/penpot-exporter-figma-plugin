export const translateLineNode = (node: LineNode): VectorPaths => {
  const commands = [
    {
      command: 'moveto',
      code: 'M',
      x: 0,
      y: 0
    },
    {
      command: 'lineto',
      code: 'L',
      x: node.width,
      y: node.height
    }
  ];

  return [
    {
      windingRule: 'NONE',
      data: commands.reduce((acc, { code, x, y }) => acc + `${code} ${x} ${y}`, '')
    }
  ];
};
