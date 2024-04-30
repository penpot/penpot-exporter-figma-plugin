import { useEffect, useState } from 'react';

import { createPenpotFile } from '@ui/converters';
import { PenpotDocument } from '@ui/lib/types/penpotDocument';

import Logo from './logo.svg?react';

export const PenpotExporter = () => {
  const [missingFonts, setMissingFonts] = useState<string[]>();
  const [exporting, setExporting] = useState(false);

  const onMessage = (event: MessageEvent<{ pluginMessage: { type: string; data: unknown } }>) => {
    if (event.data.pluginMessage?.type == 'FIGMAFILE') {
      const document = event.data.pluginMessage.data as PenpotDocument;
      const file = createPenpotFile(document);

      file.export();

      setExporting(false);
    } else if (event.data.pluginMessage?.type == 'CUSTOM_FONTS') {
      setMissingFonts(event.data.pluginMessage.data as string[]);
    }
  };

  const onCreatePenpot = () => {
    setExporting(true);

    parent.postMessage({ pluginMessage: { type: 'export' } }, '*');
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  const setDimensions = () => {
    if (missingFonts === undefined) return;
    const isMissingFonts = missingFonts.length > 0;

    let width = 300;
    let height = 280;

    if (isMissingFonts) {
      height += missingFonts.length * 20;
      width = 400;
      parent.postMessage({ pluginMessage: { type: 'resize', width: width, height: height } }, '*');
    }
  };

  useEffect(() => {
    window.addEventListener('message', onMessage);

    parent.postMessage({ pluginMessage: { type: 'ready' } }, '*');

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  useEffect(() => {
    setDimensions();
  }, [missingFonts]);

  const pluginReady = missingFonts !== undefined;
  const missingFontsSection =
    missingFonts && missingFonts.length > 0 ? (
      <section>
        <div style={{ display: missingFonts.length > 0 ? 'inline' : 'none' }}>
          <div id="missing-fonts">
            {missingFonts.length} non-default font
            {missingFonts.length > 1 ? 's' : ''}:{' '}
          </div>
          <small>Ensure fonts are installed in Penpot before exporting.</small>
          <div id="missing-fonts-list">
            <ul>
              {Array.from(missingFonts).map(font => (
                <li key={font}>{font}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    ) : null;

  return (
    <main>
      <header>
        <Logo />
        <h2>Penpot Exporter</h2>
      </header>
      {pluginReady ? missingFontsSection : <section>Checking for missing fonts...</section>}
      <footer>
        <button className="brand" disabled={exporting || !pluginReady} onClick={onCreatePenpot}>
          {exporting ? 'Exporting...' : 'Export to Penpot'}
        </button>
        <button onClick={onCancel}>Cancel</button>
      </footer>
    </main>
  );
};
