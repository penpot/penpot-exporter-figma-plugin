import { Banner, Button } from '@create-figma-plugin/ui';
import { CircleAlert } from 'lucide-react';
import type { JSX } from 'preact';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';

export const ExternalVariablesWarning = (): JSX.Element => {
  const { externalVariablesWarning, libraryNames, exportWithExternalVariables, cancel } =
    useFigmaContext();

  if (!externalVariablesWarning || externalVariablesWarning.length === 0) {
    return <></>;
  }

  const uniqueLibraryNames =
    libraryNames.length > 0 ? libraryNames.join(', ') : 'external Design System';

  return (
    <Stack space="medium">
      <Stack space="xsmall">
        <Banner icon={<CircleAlert size={14} />} variant="warning">
          <strong>External Design System variables detected</strong>
        </Banner>
        <p>
          Your document uses variables from <strong>{uniqueLibraryNames}</strong>. These variables
          will export with their visual values, but won&apos;t be connected to tokens in Penpot.
        </p>
        <p>
          <strong>What would you like to do?</strong>
        </p>
      </Stack>

      <Stack space="xsmall" direction="row">
        <Button fullWidth onClick={() => exportWithExternalVariables(false)}>
          <strong>Export as is</strong>
        </Button>
        <Button fullWidth onClick={() => exportWithExternalVariables(true)}>
          <strong>Convert to local variables</strong>
        </Button>
      </Stack>

      <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>
        <strong>Export as is:</strong> Export with visual values only (no token connections in
        Penpot).
        <br />
        <strong>Convert to local variables:</strong> Copy external variables as local tokens in the
        Penpot file.
      </p>

      <Button secondary onClick={cancel} fullWidth>
        Cancel
      </Button>
    </Stack>
  );
};
