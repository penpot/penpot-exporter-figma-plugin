import { Banner, Button, IconInfoSmall24 } from '@create-figma-plugin/ui';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';

export const PluginReload = () => {
  const { reload, cancel } = useFigmaContext();

  return (
    <Stack space="small">
      <Banner icon={<IconInfoSmall24 />}>
        Changes detected in fonts.
        <br />
        Please reload the plug-in to ensure all modifications are included in the exported file.
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
};
