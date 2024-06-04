import { Banner, Button, IconInfo32 } from '@create-figma-plugin/ui';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';

export const PluginReload = () => {
  const { reload, cancel } = useFigmaContext();

  return (
    <Stack space="small">
      <Banner icon={<IconInfo32 />}>
        Changes detected. Please reload the plug-in to ensure all modifications are included in the
        exported file.
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
