import { Button, LoadingIndicator } from '@create-figma-plugin/ui';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Stack } from '@ui/components/Stack';
import { createPenpotFile } from '@ui/converters';
import { PenpotDocument } from '@ui/lib/types/penpotDocument';

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

  if (missingFonts === undefined) {
    return <LoadingIndicator />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(exportPenpot)}>
        <Stack space="medium">
          <MissingFontsSection fonts={missingFonts} />
          <Stack space="extra-small" direction="row">
            <Button type="submit" disabled={exporting}>
              {exporting ? 'Exporting...' : 'Export to Penpot'}
            </Button>
            <Button secondary onClick={cancel}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};
