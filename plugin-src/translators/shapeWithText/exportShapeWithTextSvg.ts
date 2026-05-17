// Exports the ShapeWithText node as an SVG string. The svgOutlineText flag is
// off so the text stays as `<text>` (we parse its tspans for layout); we
// strip ID attributes to keep the output tight.
export const exportShapeWithTextSvg = async (
  node: ShapeWithTextNode
): Promise<string | undefined> => {
  try {
    return await node.exportAsync({
      format: 'SVG_STRING',
      svgOutlineText: false,
      svgIdAttribute: false
    });
  } catch (error) {
    console.warn(`Failed to export shape-with-text "${node.name}" as SVG`, error);
    return;
  }
};
