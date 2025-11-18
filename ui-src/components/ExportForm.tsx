import { Button, Link, Muted } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';
import { FormProvider, useForm } from 'react-hook-form';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';

export type FormValues = Record<string, string>;

export const ExportForm = (): JSX.Element => {
  const { cancel, exportPenpot } = useFigmaContext();
  const methods = useForm<FormValues>();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(exportPenpot)}>
        <Stack space="medium">
          <Stack space="xsmall">
            <strong style={{ fontSize: 13 }}>Export your Figma file to Penpot</strong>
            <p>
              The plugin packages the current file&apos;s pages, components, styles and assets into
              a <code style={{ padding: '0 0.125rem' }}>.penpot</code> file that&apos;s ready to
              import in Penpot.
            </p>
            <p>
              You&apos;ll need a Penpot account to import the exported file — you can start with a
              free account.
            </p>
          </Stack>

          <Stack space="xsmall">
            <strong style={{ fontSize: 13 }}>How it works</strong>
            <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                Click Export to Penpot to start the conversion.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                We gather your pages, libraries and assets and prepare the export file.
              </li>
              <li>
                Download the generated file and import it in Penpot via{' '}
                <strong>Projects → Import Penpot file</strong>.
              </li>
            </ol>
          </Stack>

          <Muted>
            Need a refresher on importing?{' '}
            <Link
              href="https://help.penpot.app/user-guide/import-export/#importing-files"
              target="_blank"
            >
              Learn how →
            </Link>
          </Muted>

          <Stack space="xsmall" direction="row">
            <Button fullWidth>Start Export</Button>
            <Button secondary onClick={cancel} fullWidth>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};
