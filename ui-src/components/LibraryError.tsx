import { Banner, Button, IconWarning32, Link } from '@create-figma-plugin/ui';

import { useFigmaContext } from '@ui/context';

import { Stack } from './Stack';

export const LibraryError = () => {
  const { reload, cancel, error } = useFigmaContext();

  if (!error) return null;

  return (
    <Stack space="small">
      <Stack space="xsmall">
        <Banner icon={<IconWarning32 />} variant="warning">
          Oops! It looks like there was an <b>error generating the export file</b>.
        </Banner>
        <span>
          Please open an issue in our{' '}
          <Link
            href="https://github.com/penpot/penpot-exporter-figma-plugin/issues"
            target="_blank"
          >
            Github repository
          </Link>
          , and we&apos;ll be happy to assist you!
        </span>
        <Stack space="xsmall" direction="row">
          <Button onClick={reload} fullWidth>
            Reload
          </Button>
          <Button secondary onClick={cancel} fullWidth>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
