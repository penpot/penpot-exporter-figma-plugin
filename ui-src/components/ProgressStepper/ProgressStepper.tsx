import classNames from 'classnames';
import { Circle } from 'lucide-react';
import type { JSX } from 'preact';

import { Stack } from '@ui/components/Stack';
import { PROGRESS_STEPS, type Steps } from '@ui/types/progressMessages';

import styles from './ProgressStepper.module.css';

type ProgressStepperProps = {
  currentStep: Steps;
};

const STEP_NAMES: Record<Steps, string> = {
  processing: 'Process Figma pages',
  processAssets: 'Process Figma assets',
  buildAssets: 'Create Penpot assets',
  building: 'Create Penpot pages',
  components: 'Create components',
  exporting: 'Generate Penpot file'
};

export const ProgressStepper = ({ currentStep }: ProgressStepperProps): JSX.Element | null => {
  const currentStepIndex = PROGRESS_STEPS.indexOf(currentStep);

  if (currentStepIndex === -1) {
    return null;
  }

  return (
    <Stack space="2xsmall">
      <div className={styles['step-info']}>
        Step {currentStepIndex + 1} of {PROGRESS_STEPS.length} — {STEP_NAMES[currentStep]}
      </div>

      <Stack direction="column" space="3xsmall">
        {PROGRESS_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step}
              className={classNames(styles['step-item'], {
                [styles['step-item-active']]: isCurrent,
                [styles['step-item-completed']]: isCompleted
              })}
            >
              {isCurrent || isCompleted ? (
                <Circle size={9} style={{ fill: 'var(--figma-color-text)' }} />
              ) : (
                <Circle size={9} />
              )}
              {STEP_NAMES[step]}
            </div>
          );
        })}
      </Stack>
    </Stack>
  );
};
