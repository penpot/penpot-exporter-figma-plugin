import { NodeData, TextData } from './interfaces';

interface Signatures {
  [key: string]: string;
}

const signatures: Signatures = {
  'R0lGODdh': 'image/gif',
  'R0lGODlh': 'image/gif',
  'iVBORw0KGgo': 'image/png',
  '/9j/': 'image/jpg'
};

function detectMimeType(b64: string) {
  for (const s in signatures) {
    if (b64.indexOf(s) === 0) {
      return signatures[s];
    }
  }
}

function traverse(node: BaseNode): NodeData | TextData {
  const children: (NodeData | TextData)[] = [];

  if ('children' in node) {
    if (node.type !== 'INSTANCE') {
      for (const child of node.children) {
        children.push(traverse(child));
      }
    }
  }

  const result = {
    id: node.id,
    type: node.type,
    name: node.name,
    children: children,
    x: 'x' in node ? node.x : 0,
    y: 'y' in node ? node.y : 0,
    width: 'width' in node ? node.width : 0,
    height: 'height' in node ? node.height : 0,
    fills: 'fills' in node ? (node.fills === figma.mixed ? [] : node.fills) : [] // TODO: Support mixed fills
  };

  if (result.fills) {
    // Find any fill of type image
    const imageFill = result.fills.find(fill => fill.type === 'IMAGE');
    if (imageFill) {
      // An "image" in Figma is a shape with one or more image fills, potentially blended with other fill
      // types.  Given the complexity of mirroring this exactly in Penpot, which treats images as first-class
      // objects, we're going to simplify this by exporting this shape as a PNG image.
      'exportAsync' in node &&
        node.exportAsync({ format: 'PNG' }).then(value => {
          const b64 = figma.base64Encode(value);
          figma.ui.postMessage({
            type: 'IMAGE',
            data: {
              id: node.id,
              value: 'data:' + detectMimeType(b64) + ';base64,' + b64
            }
          });
        });
    }
  }

  if (node.type == 'TEXT') {
    const styledTextSegments = node.getStyledTextSegments([
      'fontName',
      'fontSize',
      'fontWeight',
      'lineHeight',
      'letterSpacing',
      'textCase',
      'textDecoration',
      'fills'
    ]);

    if (styledTextSegments[0]) {
      const font = {
        ...result,
        fontName: styledTextSegments[0].fontName,
        fontSize: styledTextSegments[0].fontSize.toString(),
        fontWeight: styledTextSegments[0].fontWeight.toString(),
        characters: node.characters,
        lineHeight: styledTextSegments[0].lineHeight,
        letterSpacing: styledTextSegments[0].letterSpacing,
        fills: styledTextSegments[0].fills,
        textCase: styledTextSegments[0].textCase,
        textDecoration: styledTextSegments[0].textDecoration,
        textAlignHorizontal: node.textAlignHorizontal,
        textAlignVertical: node.textAlignVertical,
        children: styledTextSegments
      };

      return font as TextData;
    }
  }

  return result as NodeData;
}

figma.showUI(__html__, { themeColors: true, height: 200, width: 300 });

const root: NodeData | TextData = traverse(figma.root); // start the traversal at the root
figma.ui.postMessage({ type: 'FIGMAFILE', data: root });

figma.ui.onmessage = msg => {
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }

  if (msg.type === 'resize') {
    figma.ui.resize(msg.width, msg.height);
  }
};
