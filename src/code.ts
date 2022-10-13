

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
    fills: node.fills
  }

  if (node.fills){
    for (const paint of node.fills) {
      if (paint.type === 'IMAGE') {
        // Get the (encoded) bytes for this image.
        const image = figma.getImageByHash(paint.imageHash);
        image.getBytesAsync().then((value) => {
          const b64 = figma.base64Encode(value);
          figma.ui.postMessage({type: "IMAGE", data: {
            imageHash: paint.imageHash,
            value: "data:" + detectMimeType(b64) + ";base64," + b64
          }});
        });
      }
    }
  }


  //TODO Fix text segments with https://www.figma.com/plugin-docs/api/properties/TextNode-getstyledtextsegments
  const defaultFontName = {
      "family": "Inter",
      "style": "Regular"
  }

  const defaultFontSize = 12;

  const defaultFontWeight = 400
  const defaultLineHeight = {
      "unit": "AUTO"
  };

  const defaultLetterSpacing = {
    "unit": "PERCENT",
    "value": 0
  }

  const defaultTextAlignHorizontal = "LEFT";
  const defaultTextAlignVertical = "TOP";

  if (node.type == "TEXT") {

    let font = {
      fontName: typeof node.fontName === 'symbol'? defaultFontName: node.fontName, //TODO This means a text with several styles
      fontSize: typeof node.fontSize === 'symbol'? defaultFontSize: node.fontSize, //TODO This means a text with several styles
      fontWeight: typeof node.fontWeight === 'symbol'? defaultFontWeight: node.fontWeight, //TODO This means a text with several styles
      characters: typeof node.characters === 'symbol'? '': node.characters, //TODO This means a text with several styles
      lineHeight: typeof node.lineHeight === 'symbol'? defaultLineHeight: node.lineHeight, //TODO This means a text with several styles
      letterSpacing: typeof node.letterSpacing === 'symbol'? defaultLetterSpacing: node.letterSpacing, //TODO This means a text with several styles
      textAlignHorizontal: typeof node.textAlignHorizontal === 'symbol'? defaultTextAlignHorizontal: node.textAlignHorizontal, //TODO This means a text with several styles
      textAlignVertical: typeof node.textAlignVertical === 'symbol'? defaultTextAlignVertical: node.textAlignVertical, //TODO This means a text with several styles
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
