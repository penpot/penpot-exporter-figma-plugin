import {
  Button,
  Muted,
  SegmentedControl,
  type SegmentedControlOption
} from '@create-figma-plugin/ui';
import type { JSX, TargetedEvent } from 'preact';
import { useEffect } from 'preact/hooks';
import { FormProvider, useForm } from 'react-hook-form';

import { ExternalLibrariesFieldSet } from '@ui/components/ExternalLibrariesFieldSet';
import { Stack } from '@ui/components/Stack';
import { TwoColumnLayout } from '@ui/components/TwoColumnLayout';
import { type FormValues, useFigmaContext } from '@ui/context';
import type { ExportScope } from '@ui/types';

const scopeOptions: SegmentedControlOption[] = [
  { value: 'all', children: 'All pages' },
  { value: 'current', children: 'Current page' }
];

export const ExportForm = (): JSX.Element => {
  const { cancel, exportPenpot, exportScope, exportLibraries, setExportScope } = useFigmaContext();
  const methods = useForm<FormValues>({
    defaultValues: {
      externalLibraries: []
    }
  });

  useEffect(() => {
    if (exportLibraries.length > 0) {
      methods.reset({
        externalLibraries: exportLibraries.map(name => ({ name, uuid: '' }))
      });
    }
  }, [exportLibraries]);

  const handleScopeChange = (event: TargetedEvent<HTMLInputElement>): void => {
    setExportScope(event.currentTarget.value as ExportScope);
  };

  const leftColumn = (
    <Stack space="medium">
      <Stack space="xsmall">
        <strong style={{ fontSize: 13 }}>Export your Figma file to Penpot</strong>
        <p>
          The plugin packages the current file&apos;s pages, components, styles and assets into a{' '}
          <code style={{ padding: '0 0.125rem' }}>.penpot</code> file that&apos;s ready to import in
          Penpot.
        </p>
        <p>
          You&apos;ll need a Penpot account to import the exported file — you can start with a free
          account.
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
    </Stack>
  );

  const rightColumn = (
    <Stack space="medium">
      <Stack space="xsmall">
        <strong style={{ fontSize: 13 }}>Export scope</strong>
        <div style={{ width: 'fit-content' }}>
          <SegmentedControl
            options={scopeOptions}
            value={exportScope}
            onChange={handleScopeChange}
          />
        </div>
        <Muted>
          For large documents, try exporting the current page first to test, then do a full export.
        </Muted>
      </Stack>

      <ExternalLibrariesFieldSet />
    </Stack>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(exportPenpot)}>
        <Stack space="medium">
          <TwoColumnLayout left={leftColumn} right={rightColumn} />
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'right',
              width: '100%'
            }}
          >
            <Button style={{ flex: '0 1 auto' }}>
              <strong>Start Export</strong>
            </Button>
            <Button secondary onClick={cancel} style={{ flex: '0 1 auto' }}>
              Cancel
            </Button>
          </div>
        </Stack>
      </form>
    </FormProvider>
  );
};
