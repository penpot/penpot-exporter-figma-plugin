import type { JSX } from 'preact';

import { ProgressBar } from '@ui/components/ProgressBar';
import { ProgressStepper } from '@ui/components/ProgressStepper';
import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';
import { type Steps } from '@ui/types/progressMessages';

type Messages = {
  total: string;
  current?: string;
};

const stepMessages: Record<Steps, Messages> = {
  processing: {
    total: 'pages processed 💪',
    current: 'Currently processing layer'
  },
  processAssets: {
    total: 'Processing assets 📸 🎨 📝'
  },
  buildAssets: {
    total: 'Building assets 📸 🎨 📝'
  },
  building: {
    total: 'Building pages 🏗️'
  },
  components: {
    total: 'Building components 🏗️'
  },
  exporting: {
    total: 'Generating Penpot file 🚀'
  }
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

  const currentText = stepMessages[step].current;

  switch (step) {
    case 'processAssets':
    case 'buildAssets':
    case 'building':
    case 'components':
    case 'exporting':
      return <>{stepMessages[step].total}</>;
    case 'processing':
      return (
        <>
          {`${progress.processedItems} of ${progress.totalItems}`} {stepMessages[step].total}
          <br />
          {currentText}
          <br />
          {'“' + truncateText(progress.currentItem, 35) + '”'}
        </>
      );
  }
};

export const ExporterProgress = (): JSX.Element => {
  const { progressPercentage, step } = useFigmaContext();

  return (
    <Stack space="medium" horizontalAlign="center">
      {step && <ProgressStepper currentStep={step} />}
      <Stack space="2xsmall" style={{ textAlign: 'center' }}>
        <ProgressBar value={progressPercentage} />
        <StepProgress />
      </Stack>
    </Stack>
  );
};
