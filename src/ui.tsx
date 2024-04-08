import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { createPenpotFile } from './converters';
import './ui.css';

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

  // TODO: FIX THIS CODE
  // addFontWarning(font: string) {
  //   const newMissingFonts = this.state.missingFonts;
  //   newMissingFonts.add(font);
  //
  //   this.setState(() => ({ missingFonts: newMissingFonts }));
  // }

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
      const file = createPenpotFile(event.data.pluginMessage.data);
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
