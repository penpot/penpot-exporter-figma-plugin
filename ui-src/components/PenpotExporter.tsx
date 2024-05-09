import { Banner, Button, IconInfo32, LoadingIndicator } from '@create-figma-plugin/ui';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ProgressSection } from '@ui/components/ProgressSection';
import { Stack } from '@ui/components/Stack';
import { createPenpotFile } from '@ui/converters';
import { PenpotDocument } from '@ui/lib/types/penpotDocument';

import { MissingFontsSection } from './MissingFontsSection';

type FormValues = Record<string, string>;

export const PenpotExporter = () => {
  const [missingFonts, setMissingFonts] = useState<string[]>();
  const [needsReload, setNeedsReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [currentNode, setCurrentNode] = useState<string | undefined>();
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
      setLoading(false);
      setNeedsReload(false);
    } else if (event.data.pluginMessage?.type == 'CHANGES_DETECTED') {
      setNeedsReload(true);
    } else if (event.data.pluginMessage?.type === 'PROGRESS') {
      setCurrentNode(event.data.pluginMessage.data as string);
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

  const reload = () => {
    setLoading(true);
    parent.postMessage({ pluginMessage: { type: 'reload' } }, '*');
  };

  useEffect(() => {
    window.addEventListener('message', onMessage);

    parent.postMessage({ pluginMessage: { type: 'ready' } }, '*');

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (needsReload) {
    return (
      <Stack space="small">
        <Banner icon={<IconInfo32 />}>
          Changes detected. Please reload the plug-in to ensure all modifications are included in
          the exported file.
        </Banner>
        <Stack space="xsmall" direction="row">
          <Button onClick={reload} fullWidth>
            Reload
          </Button>
          <Button secondary onClick={cancel} fullWidth>
            Cancel
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(exportPenpot)}>
        <Stack space="medium">
          <MissingFontsSection fonts={missingFonts} />
          <ProgressSection currentNode={currentNode} exporting={exporting} />
          <Stack space="xsmall" direction="row">
            <Button type="submit" loading={exporting} fullWidth>
              Export to Penpot
            </Button>
            <Button secondary onClick={cancel} fullWidth>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};
