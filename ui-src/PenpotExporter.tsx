import { useEffect, useState } from 'react';

import { createPenpotFile } from '@ui/converters';
import { PenpotDocument } from '@ui/lib/types/penpotDocument';

import { Loader } from './Loader';
import { MissingFontsSection } from './MissingFontsSection';
import Logo from './logo.svg?react';

export const PenpotExporter = () => {
  const [missingFonts, setMissingFonts] = useState<string[]>();
  const [exporting, setExporting] = useState(false);

  const onMessage = (event: MessageEvent<{ pluginMessage: { type: string; data: unknown } }>) => {
    if (event.data.pluginMessage?.type == 'PENPOT_DOCUMENT') {
      const document = event.data.pluginMessage.data as PenpotDocument;
      const file = createPenpotFile(document);

      file.export();

      setExporting(false);
    } else if (event.data.pluginMessage?.type == 'CUSTOM_FONTS') {
      setMissingFonts(event.data.pluginMessage.data as string[]);
    }
  };

  const exportPenpot = () => {
    setExporting(true);

    parent.postMessage({ pluginMessage: { type: 'export' } }, '*');
  };

  const cancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  useEffect(() => {
    window.addEventListener('message', onMessage);

    parent.postMessage({ pluginMessage: { type: 'ready' } }, '*');

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  const pluginReady = missingFonts !== undefined;

  return (
    <main>
      <header>
        <Logo />
        <h2>Penpot Exporter</h2>
      </header>
      <Loader loading={!pluginReady} />
      <MissingFontsSection missingFonts={missingFonts} />
      <footer>
        <button className="brand" disabled={exporting || !pluginReady} onClick={exportPenpot}>
          {exporting ? 'Exporting...' : 'Export to Penpot'}
        </button>
        <button onClick={cancel}>Cancel</button>
      </footer>
    </main>
  );
};
