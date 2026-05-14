import type { JSX } from 'preact';

import { ProgressBar } from '@ui/components/ProgressBar';
import { ProgressStepper } from '@ui/components/ProgressStepper';
import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';
import type { Steps } from '@ui/types';

const stepMessages: Record<Steps, string> = {
  processing: 'Figma pages scanned 💪',
  processAssets: 'Figma assets gathered 📸 🎨 📝',
  buildAssets: 'Penpot assets built 📸 🎨 📝',
  building: 'Penpot pages assembled 🏗️',
  components: 'Components created 🏗️',
  exporting: 'Packaging Penpot file 🚀'
};

const StepProgress = (): JSX.Element | null => {
  const { progress, step, stepLabel } = useFigmaContext();

  if (!step) return null;

  const message = stepLabel ?? stepMessages[step];

  switch (step) {
    case 'exporting':
      return (
        <p>
          {message}
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
          {`${progress.processedItems} of ${progress.totalItems}`} {message}
          <br />
          <br />
        </p>
      );
    case 'processing':
      return (
        <p>
          {`${progress.processedItems} of ${progress.totalItems}`} {message}
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
  const { progressPercentage, step, stepName } = useFigmaContext();

  return (
    <Stack space="small">
      <strong style={{ fontSize: 15 }}>Exporting to Penpot</strong>
      <ProgressStepper currentStep={step} currentStepName={stepName} />
      <Stack space="2xsmall">
        <ProgressBar value={progressPercentage} />
        <StepProgress />
      </Stack>
    </Stack>
  );
};
