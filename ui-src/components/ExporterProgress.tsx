import type { JSX } from 'preact';

import { ProgressBar } from '@ui/components/ProgressBar';
import { ProgressStepper } from '@ui/components/ProgressStepper';
import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';
import type { Steps } from '@ui/types/progressMessages';

const stepMessages: Record<Steps, string> = {
  processing: 'Figma pages processed 💪',
  processAssets: 'Processing Figma assets 📸 🎨 📝',
  buildAssets: 'Creating Penpot assets 📸 🎨 📝',
  building: 'Creating Penpot pages 🏗️',
  components: 'Creating components 🏗️',
  exporting: 'Generating Penpot file 🚀'
};

const StepProgress = (): JSX.Element | null => {
  const { progress, step } = useFigmaContext();

  const truncateText = (text: string, maxChars: number): string => {
    if (text.length <= maxChars) {
      return text;
    }

    return text.slice(0, maxChars) + '...';
  };

  if (!step) return null;

  switch (step) {
    case 'exporting':
      return (
        <>
          {stepMessages[step]}
          <br />
          <br />
        </>
      );
    case 'processAssets':
    case 'buildAssets':
    case 'components':
    case 'building':
      return (
        <>
          {`${progress.processedItems} of ${progress.totalItems}`} {stepMessages[step]}
          <br />
          <br />
        </>
      );
    case 'processing':
      return (
        <>
          {`${progress.processedItems} of ${progress.totalItems}`} {stepMessages[step]}
          <br />
          {'Layer: “' + truncateText(progress.currentItem, 35) + '”'}
        </>
      );
  }
};

export const ExporterProgress = (): JSX.Element => {
  const { progressPercentage, step } = useFigmaContext();

  return (
    <Stack space="small">
      <strong style={{ fontSize: 13 }}>Exporting to Penpot...</strong>
      <ProgressStepper currentStep={step} />
      <Stack space="2xsmall">
        <ProgressBar value={progressPercentage} />
        <StepProgress />
      </Stack>
    </Stack>
  );
};
