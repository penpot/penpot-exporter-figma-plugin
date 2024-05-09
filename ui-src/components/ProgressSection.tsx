import { Banner, IconInfo32 } from '@create-figma-plugin/ui';

import { Stack } from './Stack';

type ProgressSectionProps = {
  currentNode?: string;
  exporting: boolean;
};

export const ProgressSection = ({ currentNode, exporting }: ProgressSectionProps) => {
  if (!currentNode || !exporting) return null;

  return (
    <Stack space="small">
      <Banner icon={<IconInfo32 />}>Exporting: {currentNode}</Banner>
    </Stack>
  );
};
