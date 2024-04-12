export const calculateAdjustment = (node: SceneNode) => {
  // For each child, check whether the X or Y position is less than 0 and less than the
  // current adjustment.
  let adjustedX = 0;
  let adjustedY = 0;
  if ('children' in node) {
    for (const child of node.children) {
      if (child.x < adjustedX) {
        adjustedX = child.x;
      }
      if (child.y < adjustedY) {
        adjustedY = child.y;
      }
    }
  }
  return [adjustedX, adjustedY];
};
