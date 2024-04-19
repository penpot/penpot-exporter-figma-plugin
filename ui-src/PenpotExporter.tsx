import { useEffect, useState } from 'react';
import slugify from 'slugify';

import { createPenpotFile } from '@ui/converters';
import { PenpotDocument } from '@ui/lib/types/penpotDocument';
import { validateFont } from '@ui/validators';

import Logo from './logo.svg?react';

export const PenpotExporter = () => {
  const [missingFonts, setMissingFonts] = useState(new Set<string>());
  const [exporting, setExporting] = useState(false);

  const addFontWarning = (font: string) => {
    setMissingFonts(missingFonts => missingFonts.add(font));
  };

  const onMessage = (event: MessageEvent<{ pluginMessage: { type: string; data: unknown } }>) => {
    if (event.data.pluginMessage?.type == 'FIGMAFILE') {
      const document = event.data.pluginMessage.data as PenpotDocument;
      const file = createPenpotFile(document);

      file.export();

      setExporting(false);
    } else if (event.data.pluginMessage?.type == 'FONT_NAME') {
      const fontName = event.data.pluginMessage.data as string;

      if (!validateFont(fontName)) {
        addFontWarning(slugify(fontName.toLowerCase()));
      }
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
    const isMissingFonts = missingFonts.size > 0;

    let width = 300;
    let height = 280;

    if (isMissingFonts) {
      height += missingFonts.size * 20;
      width = 400;
      parent.postMessage({ pluginMessage: { type: 'resize', width: width, height: height } }, '*');
    }
  };

  useEffect(() => {
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  useEffect(() => {
    setDimensions();
  }, [missingFonts]);

  return (
    <main>
      <header>
        <Logo />
        <h2>Penpot Exporter</h2>
      </header>
      <section>
        <div style={{ display: missingFonts.size > 0 ? 'inline' : 'none' }}>
          <div id="missing-fonts">
            {missingFonts.size} non-default font
            {missingFonts.size > 1 ? 's' : ''}:{' '}
          </div>
          <small>Ensure fonts are installed in Penpot before importing.</small>
          <div id="missing-fonts-list">
            <ul>
              {Array.from(missingFonts).map(font => (
                <li key={font}>{font}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <footer>
        <button className="brand" disabled={exporting} onClick={onCreatePenpot}>
          {exporting ? 'Exporting...' : 'Export to Penpot'}
        </button>
        <button onClick={onCancel}>Cancel</button>
      </footer>
    </main>
  );
};
