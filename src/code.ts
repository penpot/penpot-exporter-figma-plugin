

let fileData = [];

type NodeData = {
  id: string
  name: string,
  type: string,
  children: Node[],
  x: number,
  y: number,
  width: number,
  height: number,
  fills: any
}

const signatures = {
  R0lGODdh: "image/gif",
  R0lGODlh: "image/gif",
  iVBORw0KGgo: "image/png",
  "/9j/": "image/jpg"
};

function detectMimeType(b64) {
  for (var s in signatures) {
    if (b64.indexOf(s) === 0) {
      return signatures[s];
    }
  }
}

function traverse(node): NodeData {
  let children:any[] = [];

  if ("children" in node) {
    if (node.type !== "INSTANCE") {
      for (const child of node.children) {
        children.push (traverse(child))
      }
    }
  }

  let result = {
    id: node.id,
    type: node.type,
    name: node.name,
    children: children,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    fills: node.fills === figma.mixed ? [] : node.fills //TODO: Support mixed fills
  }

  if (node.fills && Array.isArray(node.fills)){

    // Find any fill of type image
    const imageFill = node.fills.find(fill => fill.type === "IMAGE");
    if (imageFill) {
      // An "image" in Figma is a shape with one or more image fills, potentially blended with other fill
      // types.  Given the complexity of mirroring this exactly in Penpot, which treats images as first-class
      // objects, we're going to simplify this by exporting this shape as a PNG image.
      node.exportAsync({format: "PNG"}).then((value) => {
        const b64 = figma.base64Encode(value);
        figma.ui.postMessage({type: "IMAGE", data: {
          id: node.id,
          value: "data:" + detectMimeType(b64) + ";base64," + b64
        }});
      });
    }
  }

  if (node.type == "TEXT") {
    const styledTextSegments = node.getStyledTextSegments(["fontName", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textCase", "textDecoration", "fills"]);
    let font = {
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
    result = {...result, ...font};
  }

  return result;
}

figma.showUI(__html__, { themeColors: true, height: 200, width: 300 });

let root: NodeData = traverse(figma.root) // start the traversal at the root
figma.ui.postMessage({type: "FIGMAFILE", data: root});

figma.ui.onmessage = (msg) => {
  if (msg.type === "cancel") {
    figma.closePlugin();
  }

  if (msg.type === "resize") {
    figma.ui.resize(msg.width, msg.height);
  }

};
