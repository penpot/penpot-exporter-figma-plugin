import * as React from 'react';
import { createRoot } from 'react-dom/client';
import slugify from 'slugify';

import fonts from './gfonts.json';
import { NodeData, TextData, TextDataChildren } from './interfaces';
import { PenpotFile, createFile } from './penpot';
import './ui.css';

const gfonts = new Set(fonts);

type PenpotExporterState = {
  missingFonts: Set<string>;
  exporting: boolean;
};

export default class PenpotExporter extends React.Component<unknown, PenpotExporterState> {
  state: PenpotExporterState = {
    missingFonts: new Set(),
    exporting: false
  };

  componentDidMount = () => {
    window.addEventListener('message', this.onMessage);
  };

  componentDidUpdate = () => {
    this.setDimensions();
  };

  componentWillUnmount = () => {
    window.removeEventListener('message', this.onMessage);
  };

  rgbToHex = (color: RGB) => {
    const r = Math.round(255 * color.r);
    const g = Math.round(255 * color.g);
    const b = Math.round(255 * color.b);
    const rgb = (r << 16) | (g << 8) | (b << 0);
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
  };

  translateSolidFill(fill: SolidPaint) {
    return {
      fillColor: this.rgbToHex(fill.color),
      fillOpacity: fill.visible === false ? 0 : fill.opacity
    };
  }

  translateGradientLinearFill(fill: GradientPaint /*, width: number, height: number*/) {
    // const points = extractLinearGradientParamsFromTransform(width, height, fill.gradientTransform);
    return {
      fillColorGradient: {
        type: Symbol.for('linear'),
        width: 1,
        // startX: points.start[0] / width,
        // startY: points.start[1] / height,
        // endX: points.end[0] / width,
        // endY: points.end[1] / height,
        stops: [
          {
            color: this.rgbToHex(fill.gradientStops[0].color),
            offset: fill.gradientStops[0].position,
            opacity: fill.gradientStops[0].color.a * (fill.opacity ?? 1)
          },
          {
            color: this.rgbToHex(fill.gradientStops[1].color),
            offset: fill.gradientStops[1].position,
            opacity: fill.gradientStops[1].color.a * (fill.opacity ?? 1)
          }
        ]
      },
      fillOpacity: fill.visible === false ? 0 : undefined
    };
  }

  translateFill(fill: Paint /*, width: number, height: number*/) {
    if (fill.type === 'SOLID') {
      return this.translateSolidFill(fill);
    } else if (fill.type === 'GRADIENT_LINEAR') {
      return this.translateGradientLinearFill(fill /*, width, height*/);
    } else {
      console.error('Color type ' + fill.type + ' not supported yet');
      return null;
    }
  }

  translateFills(fills: readonly Paint[] /*, width: number, height: number*/) {
    const penpotFills = [];
    let penpotFill = null;
    for (const fill of fills) {
      penpotFill = this.translateFill(fill /*, width, height*/);

      if (penpotFill !== null) {
        penpotFills.unshift(penpotFill);
      }
    }
    return penpotFills;
  }

  addFontWarning(font: string) {
    const newMissingFonts = this.state.missingFonts;
    newMissingFonts.add(font);

    this.setState(() => ({ missingFonts: newMissingFonts }));
  }

  createPenpotPage(file: PenpotFile, node: NodeData) {
    file.addPage(node.name);
    for (const child of node.children) {
      this.createPenpotItem(file, child, 0, 0);
    }
    file.closePage();
  }

  createPenpotBoard(file: PenpotFile, node: NodeData, baseX: number, baseY: number) {
    file.addArtboard({
      name: node.name,
      x: node.x + baseX,
      y: node.y + baseY,
      width: node.width,
      height: node.height,
      fills: this.translateFills(node.fills /*, node.width, node.height*/)
    });
    for (const child of node.children) {
      this.createPenpotItem(file, child, node.x + baseX, node.y + baseY);
    }
    file.closeArtboard();
  }

  createPenpotGroup(file: PenpotFile, node: NodeData, baseX: number, baseY: number) {
    file.addGroup({ name: node.name });
    for (const child of node.children) {
      this.createPenpotItem(file, child, baseX, baseY);
    }
    file.closeGroup();
  }

  createPenpotRectangle(file: PenpotFile, node: NodeData, baseX: number, baseY: number) {
    file.createRect({
      name: node.name,
      x: node.x + baseX,
      y: node.y + baseY,
      width: node.width,
      height: node.height,
      fills: this.translateFills(node.fills /*, node.width, node.height*/)
    });
  }

  createPenpotCircle(file: PenpotFile, node: NodeData, baseX: number, baseY: number) {
    file.createCircle({
      name: node.name,
      x: node.x + baseX,
      y: node.y + baseY,
      width: node.width,
      height: node.height,
      fills: this.translateFills(node.fills /*, node.width, node.height*/)
    });
  }

  translateHorizontalAlign(align: string) {
    if (align === 'RIGHT') {
      return Symbol.for('right');
    }
    if (align === 'CENTER') {
      return Symbol.for('center');
    }
    return Symbol.for('left');
  }

  translateVerticalAlign(align: string) {
    if (align === 'BOTTOM') {
      return Symbol.for('bottom');
    }
    if (align === 'CENTER') {
      return Symbol.for('center');
    }
    return Symbol.for('top');
  }

  translateFontStyle(style: string) {
    return style.toLowerCase().replace(/\s/g, '');
  }

  getTextDecoration(node: TextData | TextDataChildren) {
    const textDecoration = node.textDecoration;
    if (textDecoration === 'STRIKETHROUGH') {
      return 'line-through';
    }
    if (textDecoration === 'UNDERLINE') {
      return 'underline';
    }
    return 'none';
  }

  getTextTransform(node: TextData | TextDataChildren) {
    const textCase = node.textCase;
    if (textCase === 'UPPER') {
      return 'uppercase';
    }
    if (textCase === 'LOWER') {
      return 'lowercase';
    }
    if (textCase === 'TITLE') {
      return 'capitalize';
    }
    return 'none';
  }

  validateFont(fontName: FontName) {
    const name = slugify(fontName.family.toLowerCase());
    if (!gfonts.has(name)) {
      this.addFontWarning(name);
    }
  }

  createPenpotText(file: PenpotFile, node: TextData, baseX: number, baseY: number) {
    const children = node.children.map(val => {
      this.validateFont(val.fontName);

      return {
        lineHeight: val.lineHeight,
        fontStyle: 'normal',
        textAlign: this.translateHorizontalAlign(node.textAlignHorizontal),
        fontId: 'gfont-' + slugify(val.fontName.family.toLowerCase()),
        fontSize: val.fontSize.toString(),
        fontWeight: val.fontWeight.toString(),
        fontVariantId: this.translateFontStyle(val.fontName.style),
        textDecoration: this.getTextDecoration(val),
        textTransform: this.getTextTransform(val),
        letterSpacing: val.letterSpacing,
        fills: this.translateFills(val.fills /*, node.width, node.height*/),
        fontFamily: val.fontName.family,
        text: val.characters
      };
    });

    this.validateFont(node.fontName);

    file.createText({
      name: node.name,
      x: node.x + baseX,
      y: node.y + baseY,
      width: node.width,
      height: node.height,
      rotation: 0,
      type: Symbol.for('text'),
      content: {
        type: 'root',
        verticalAlign: this.translateVerticalAlign(node.textAlignVertical),
        children: [
          {
            type: 'paragraph-set',
            children: [
              {
                lineHeight: node.lineHeight,
                fontStyle: 'normal',
                children: children,
                textTransform: this.getTextTransform(node),
                textAlign: this.translateHorizontalAlign(node.textAlignHorizontal),
                fontId: 'gfont-' + slugify(node.fontName.family.toLowerCase()),
                fontSize: node.fontSize.toString(),
                fontWeight: node.fontWeight.toString(),
                type: 'paragraph',
                textDecoration: this.getTextDecoration(node),
                letterSpacing: node.letterSpacing,
                fills: this.translateFills(node.fills /*, node.width, node.height*/),
                fontFamily: node.fontName.family
              }
            ]
          }
        ]
      }
    });
  }

  createPenpotImage(file: PenpotFile, node: NodeData, baseX: number, baseY: number) {
    file.createImage({
      name: node.name,
      x: node.x + baseX,
      y: node.y + baseY,
      width: node.width,
      height: node.height,
      metadata: {
        width: node.width,
        height: node.height
      },
      dataUri: node.imageFill
    });
  }

  calculateAdjustment(node: NodeData) {
    // For each child, check whether the X or Y position is less than 0 and less than the
    // current adjustment.
    let adjustedX = 0;
    let adjustedY = 0;
    for (const child of node.children) {
      if (child.x < adjustedX) {
        adjustedX = child.x;
      }
      if (child.y < adjustedY) {
        adjustedY = child.y;
      }
    }
    return [adjustedX, adjustedY];
  }

  createPenpotItem(file: PenpotFile, node: NodeData, baseX: number, baseY: number) {
    // We special-case images because an image in figma is a shape with one or many
    // image fills.  Given that handling images in Penpot is a bit different, we
    // rasterize a figma shape with any image fills to a PNG and then add it as a single
    // Penpot image.  Implication is that any node that has an image fill will only be
    // treated as an image, so we skip node type checks.
    const hasImageFill = node.fills?.some((fill: Paint) => fill.type === 'IMAGE');
    if (hasImageFill) {
      // If the nested frames extended the bounds of the rasterized image, we need to
      // account for this both in position on the canvas and the calculated width and
      // height of the image.
      const [adjustedX, adjustedY] = this.calculateAdjustment(node);

      this.createPenpotImage(file, node, baseX + adjustedX, baseY + adjustedY);
    } else if (node.type == 'PAGE') {
      this.createPenpotPage(file, node);
    } else if (node.type == 'FRAME') {
      this.createPenpotBoard(file, node, baseX, baseY);
    } else if (node.type == 'GROUP') {
      this.createPenpotGroup(file, node, baseX, baseY);
    } else if (node.type == 'RECTANGLE') {
      this.createPenpotRectangle(file, node, baseX, baseY);
    } else if (node.type == 'ELLIPSE') {
      this.createPenpotCircle(file, node, baseX, baseY);
    } else if (node.type == 'TEXT') {
      this.createPenpotText(file, node as unknown as TextData, baseX, baseY);
    }
  }

  createPenpotFile(node: NodeData) {
    const file = createFile(node.name);
    for (const page of node.children) {
      this.createPenpotItem(file, page, 0, 0);
    }
    return file;
  }

  onCreatePenpot = () => {
    this.setState(() => ({ exporting: true }));
    parent.postMessage({ pluginMessage: { type: 'export' } }, '*');
  };

  onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessage = (event: any) => {
    if (event.data.pluginMessage.type == 'FIGMAFILE') {
      const file = this.createPenpotFile(event.data.pluginMessage.data);
      file.export();
      this.setState(() => ({ exporting: false }));
    }
  };

  setDimensions = () => {
    const isMissingFonts = this.state.missingFonts.size > 0;

    let width = 300;
    let height = 280;

    if (isMissingFonts) {
      height += this.state.missingFonts.size * 20;
      width = 400;
      parent.postMessage({ pluginMessage: { type: 'resize', width: width, height: height } }, '*');
    }
  };

  renderFontWarnings = () => {
    return (
      <ul>
        {Array.from(this.state.missingFonts).map(font => (
          <li key={font}>{font}</li>
        ))}
      </ul>
    );
  };

  render() {
    // Update the dimensions of the plugin window based on available data and selections
    return (
      <main>
        <header>
          <img src={require('./logo.svg')} />
          <h2>Penpot Exporter</h2>
        </header>
        <section>
          <div style={{ display: this.state.missingFonts.size > 0 ? 'inline' : 'none' }}>
            <div id="missing-fonts">
              {this.state.missingFonts.size} non-default font
              {this.state.missingFonts.size > 1 ? 's' : ''}:{' '}
            </div>
            <small>Ensure fonts are installed in Penpot before importing.</small>
            <div id="missing-fonts-list">{this.renderFontWarnings()}</div>
          </div>
        </section>
        <footer>
          <button className="brand" disabled={this.state.exporting} onClick={this.onCreatePenpot}>
            {this.state.exporting ? 'Exporting...' : 'Export to Penpot'}
          </button>
          <button onClick={this.onCancel}>Cancel</button>
        </footer>
      </main>
    );
  }
}

createRoot(document.getElementById('penpot-export-page') as HTMLElement).render(
  <React.StrictMode>
    <PenpotExporter />
  </React.StrictMode>
);
