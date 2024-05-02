import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { createPenpotFile } from '@ui/converters';
import { PenpotDocument } from '@ui/lib/types/penpotDocument';

import { Loader } from './Loader';
import { MissingFontsSection } from './MissingFontsSection';

type FormValues = Record<string, string>;

export const PenpotExporter = () => {
  const [missingFonts, setMissingFonts] = useState<string[]>();
  const [exporting, setExporting] = useState(false);
  const methods = useForm<FormValues>();

  methods.getValues();

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

  const exportPenpot = (data: FormValues) => {
    setExporting(true);

    parent.postMessage(
      {
        pluginMessage: {
          type: 'export',
          data
        }
      },
      '*'
    );
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
    <FormProvider {...methods}>
      <form className="centered-form" onSubmit={methods.handleSubmit(exportPenpot)}>
        <Loader loading={!pluginReady} />
        <div className="missing-fonts-form-container">
          <MissingFontsSection fonts={missingFonts} />
        </div>
        <footer>
          <button type="submit" className="brand" disabled={exporting || !pluginReady}>
            {exporting ? 'Exporting...' : 'Export to Penpot'}
          </button>
          <button onClick={cancel}>Cancel</button>
        </footer>
      </form>
    </FormProvider>
  );
};
