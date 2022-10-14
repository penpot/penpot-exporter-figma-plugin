import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";
import * as penpot from  "./penpot.js";

import { extractLinearGradientParamsFromTransform } from "@figma-plugin/helpers";
import slugify from "slugify";

declare function require(path: string): any;


type PenpotExporterProps = {
}

type PenpotExporterState = {
  isDebug: boolean,
  penpotFileData: string
  figmaFileData: string
  figmaRootNode: NodeData
  images: { [id: string] : string; };
}

export default class PenpotExporter extends React.Component<PenpotExporterProps, PenpotExporterState> {
  state: PenpotExporterState = {
    isDebug: false,
    penpotFileData: "",
    figmaFileData: "",
    figmaRootNode: null,
    images: {}
  };

  componentDidMount = () => {
    window.addEventListener("message", this.onMessage);
  }
  componentWillUnmount = () =>{
    window.removeEventListener('message', this.onMessage);
  }

  rgbToHex = (color) => {
    const r = Math.round(255 * color.r);
    const g = Math.round(255 * color.g);
    const b = Math.round(255 * color.b);
    const rgb = (r << 16) | (g << 8) | (b << 0);
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
  }

  translateSolidFill(fill){
    return {
      fillColor: this.rgbToHex(fill.color),
      fillOpacity: fill.opacity
    }
  }

  translateGradientLinearFill(fill, width, height){
    const points = extractLinearGradientParamsFromTransform(width, height, fill.gradientTransform);
    return {
      fillColorGradient: {
         type: Symbol.for("linear"),
         width: 1,
         startX: points.start[0] / width,
         startY: points.start[1] / height,
         endX: points.end[0] / width,
         endY: points.end[1] / height,
         stops: [{
                 color: this.rgbToHex(fill.gradientStops[0].color),
                 offset: fill.gradientStops[0].position,
                 opacity: fill.gradientStops[0].color.a * fill.opacity
             },
             {
                 color: this.rgbToHex(fill.gradientStops[1].color),
                 offset: fill.gradientStops[1].position,
                 opacity: fill.gradientStops[1].color.a * fill.opacity
             }
         ]
      }
    }
  }

  translateFill(fill, width, height){
    if (fill.type === "SOLID"){
      return this.translateSolidFill(fill);
    } else if (fill.type === "GRADIENT_LINEAR"){
      return this.translateGradientLinearFill(fill, width, height);
    } else {
      console.error('Color type '+fill.type+' not supported yet');
      return null;
    }
  }

  translateFills(fills, width, height){
    let penpotFills = [];
    let penpotFill = null;
    for (var fill of fills){
      penpotFill = this.translateFill(fill, width, height);
      if (penpotFill !== null){
        penpotFills.unshift(penpotFill);
      }
    }
    return penpotFills;
  }

  createPenpotPage(file, node){
    file.addPage(node.name);
    for (var child of node.children){
      this.createPenpotItem(file, child, 0, 0);
      if (child.fills) {
        for (var fill of child.fills ){
          if (fill.type === "IMAGE"){
            this.createPenpotImage(file, child, 0, 0, this.state.images[fill.imageHash]);
          }
        }
      }
    }
    file.closePage();
  }

  createPenpotBoard(file, node, baseX, baseY){
    file.addArtboard({ name: node.name, x: node.x - baseX, y: node.y - baseY, width: node.width, height: node.height });
    for (var child of node.children){
      this.createPenpotItem(file, child, node.x - baseX, node.y - baseY);
    }
    file.closeArtboard();
  }

  createPenpotGroup(file, node, baseX, baseY){
    file.addGroup({name: node.name});
    for (var child of node.children){
      this.createPenpotItem(file, child, baseX, baseY);
    }
    file.closeGroup();
  }

  createPenpotRectangle(file, node, baseX, baseY){
    file.createRect({ name: node.name, x: node.x + baseX, y: node.y + baseY, width: node.width, height: node.height,
      fills: this.translateFills(node.fills, node.width, node.height),
      });
  }

  createPenpotCircle(file, node, baseX, baseY){
    file.createCircle({ name: node.name, x: node.x + baseX, y: node.y + baseY, width: node.width, height: node.height,
      fills: this.translateFills(node.fills, node.width, node.height),
      });
  }

  translateHorizontalAlign(align: string){
    if (align === "RIGHT"){
      return Symbol.for("right");
    }
    if (align === "CENTER"){
      return Symbol.for("center");
    }
    return Symbol.for("left")
  }

  translateVerticalAlign(align: string){
    if (align === "BOTTOM"){
      return Symbol.for("bottom");
    }
    if (align === "CENTER"){
      return Symbol.for("center");
    }
    return Symbol.for("top")
  }

  translateFontStyle(style:string){
    return style.toLowerCase().replace(/\s/g, "")
  }

  createPenpotText(file, node, baseX, baseY){
    const children = node.children.map((val) => {
      return {
        lineHeight: val.lineHeight,
        fontStyle: "normal",
        textAlign: this.translateHorizontalAlign(node.textAlignHorizontal),
        fontId: "gfont-" + slugify(val.fontName.family.toLowerCase()),
        fontSize: val.fontSize.toString(),
        fontWeight: val.fontWeight.toString(),
        fontVariantId: this.translateFontStyle(val.fontName.style),
        textDecoration: "none",
        textTransform: "none",
        letterSpacing: val.letterSpacing,
        fills: this.translateFills(val.fills, node.width, node.height),
        fontFamily: val.fontName.family,
        text: val.characters }
      });

    file.createText({
      name: node.name,
      x: node.x + baseX,
      y: node.y + baseY,
      width: node.width,
      height: node.height,
      rotation: 0,
      type: Symbol.for("text"),
      content: {
        type: "root",
        verticalAlign: this.translateVerticalAlign(node.textAlignVertical),
        children: [{
          type: "paragraph-set",
          children: [{
            lineHeight: node.lineHeight,
            fontStyle: "normal",
            children: children,
            textTransform: "none",
            textAlign: this.translateHorizontalAlign(node.textAlignHorizontal),
            fontId: "gfont-" + slugify(node.fontName.family.toLowerCase()),
            fontSize: node.fontSize.toString(),
            fontWeight: node.fontWeight.toString(),
            type: "paragraph",
            textDecoration: "none",
            letterSpacing: node.letterSpacing,
            fills: this.translateFills(node.fills, node.width, node.height),
            fontFamily: node.fontName.family
          }]
        }]
      }
    });
  }

  createPenpotImage(file, node, baseX, baseY, image){
    file.createImage({ name: node.name, x: node.x + baseX, y: node.y + baseY, width: node.width, height: node.height,
      metadata: {
        width: node.width,
        height: node.height
      },
      dataUri: image
    });
  }

  createPenpotItem(file, node, baseX, baseY){
    if (node.type == "PAGE"){
      this.createPenpotPage(file, node);
    }
    else if (node.type == "FRAME"){
      this.createPenpotBoard(file, node, baseX, baseY);
    }
    else if (node.type == "GROUP"){
      this.createPenpotGroup(file, node,baseX, baseY);
    }
    else if (node.type == "RECTANGLE"){
      this.createPenpotRectangle(file, node, baseX, baseY);
    }
    else if (node.type == "ELLIPSE"){
      this.createPenpotCircle(file, node, baseX, baseY);
    }
    else if (node.type == "TEXT"){
      this.createPenpotText(file, node, baseX, baseY);
    }
  }

  createPenpotFile(){
    let node = this.state.figmaRootNode;
    const file = penpot.createFile(node.name);
    for (var page of node.children){
      this.createPenpotItem(file, page, 0, 0);
    }
    return file;
  }

  onCreatePenpot = () => {
    const file = this.createPenpotFile();
    const penpotFileMap = file.asMap();
    this.setState(state => ({penpotFileData: JSON.stringify(penpotFileMap, (key, value) => (value instanceof Map ? [...value] : value), 4)}));
    file.export()
  };

  onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  onMessage = (event) => {
    if (event.data.pluginMessage.type == "FIGMAFILE") {
      this.setState(state => ({
        figmaFileData: JSON.stringify(event.data.pluginMessage.data, (key, value) => (value instanceof Map ? [...value] : value), 4),
        figmaRootNode: event.data.pluginMessage.data}));
    }
    else if (event.data.pluginMessage.type == "IMAGE") {
      const data = event.data.pluginMessage.data;
      this.setState(state =>
        {
          state.images[data.imageHash] = data.value;
          return state;
        }
      ) ;
    }
  }

  toggleDebug = (event) => {
    console.log(event);
    console.log(event.currentTarget);
    console.log(event.currentTarget.checked);
    const isDebug = event.currentTarget.checked;
    this.setState (state => ({isDebug: isDebug}))
    if (isDebug){
      parent.postMessage({ pluginMessage: { type: "resize", width:800, height:800 } }, "*");
    } else {
      parent.postMessage({ pluginMessage: { type: "resize", width:300, height:200 } }, "*");
    }
  }

  render() {

    return (
      <main>
        <header>
          <img src={require("./logo.svg")} />
          <h2>Penpot Exporter</h2>
        </header>
        <section>
          <div>
            <input type="checkbox" id="chkDebug" name="chkDebug" onChange={this.toggleDebug}/>
            <label htmlFor="chkDebug">Show debug data</label>
          </div>
        </section>
        <div style={{display: this.state.isDebug? '': 'none'}}>
          <section>
            <textarea style={{width:'790px', height:'270px'}} id="figma-file-data" value={this.state.figmaFileData} readOnly />
            <label htmlFor="figma-file-data">Figma file data</label>
          </section>
          <section>
            <textarea style={{width:'790px', height:'270px'}} id="penpot-file-data" value={this.state.penpotFileData} readOnly />
            <label htmlFor="penpot-file-data">Penpot file data</label>
        </section>
        </div>
        <footer>
          <button className="brand" onClick={this.onCreatePenpot}>
            Export
          </button>
          <button onClick={this.onCancel}>Cancel</button>
        </footer>
      </main>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
      <PenpotExporter />
  </React.StrictMode>,
  document.getElementById('penpot-export-page')
);
