import { Banner, Button, Link } from '@create-figma-plugin/ui';
import { CircleAlert } from 'lucide-react';
import type { JSX } from 'preact';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';

export const LibraryError = (): JSX.Element => {
  const { retry, cancel } = useFigmaContext();

  return (
    <Stack space="small">
      <Stack space="xsmall">
        <Banner icon={<CircleAlert size={14} />} variant="warning">
          Oops! It looks like there was an <b>error generating the export file</b>.
        </Banner>
        <span>
          Please open an issue in our{' '}
          <Link
            href="https://github.com/penpot/penpot-exporter-figma-plugin/issues"
            target="_blank"
          >
            Github repository →
          </Link>
          , and we&apos;ll be happy to assist you!
        </span>
        <Stack space="xsmall" direction="row">
          <Button onClick={retry} fullWidth>
            Retry
          </Button>
          <Button secondary onClick={cancel} fullWidth>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
