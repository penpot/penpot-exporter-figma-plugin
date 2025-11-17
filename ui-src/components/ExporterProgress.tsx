import type { JSX } from 'preact';

import { ProgressBar } from '@ui/components/ProgressBar';
import { ProgressStepper } from '@ui/components/ProgressStepper';
import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';
import type { Steps } from '@ui/types/progressMessages';

const stepMessages: Record<Steps, string> = {
  processing: 'Figma pages scanned 💪',
  processAssets: 'Figma assets gathered 📸 🎨 📝',
  buildAssets: 'Penpot assets built 📸 🎨 📝',
  building: 'Penpot pages assembled 🏗️',
  components: 'Components created 🏗️',
  exporting: 'Packaging Penpot file 🚀'
};

const StepProgress = (): JSX.Element | null => {
  const { progress, step } = useFigmaContext();

  if (!step) return null;

  switch (step) {
    case 'exporting':
      return (
        <p>
          {stepMessages[step]}
          <br />
          <br />
        </p>
      );
    case 'processAssets':
    case 'buildAssets':
    case 'components':
    case 'building':
      return (
        <p>
          {`${progress.processedItems} of ${progress.totalItems}`} {stepMessages[step]}
          <br />
          <br />
        </p>
      );
    case 'processing':
      return (
        <p>
          {`${progress.processedItems} of ${progress.totalItems}`} {stepMessages[step]}
          <br />
          <span
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}
          >
            {'Layer: "' + progress.currentItem + '"'}
          </span>
        </p>
      );
  }
};

export const ExporterProgress = (): JSX.Element => {
  const { progressPercentage, step } = useFigmaContext();

  return (
    <Stack space="small">
      <strong style={{ fontSize: 15 }}>Exporting to Penpot...</strong>
      <ProgressStepper currentStep={step} />
      <Stack space="2xsmall">
        <ProgressBar value={progressPercentage} />
        <StepProgress />
      </Stack>
    </Stack>
  );
};
