import classNames from 'classnames';
import { Circle, CircleCheck } from 'lucide-react';
import type { JSX } from 'preact';

import { Stack } from '@ui/components/Stack';
import { PROGRESS_STEPS, type Steps } from '@ui/types/progressMessages';

import styles from './ProgressStepper.module.css';

type ProgressStepperProps = {
  currentStep: Steps;
};

const STEP_NAMES: Record<Steps, string> = {
  tokens: 'Process tokens',
  processing: 'Scan Figma pages',
  processAssets: 'Gather linked assets',
  buildAssets: 'Build Penpot assets',
  building: 'Assemble Penpot pages',
  components: 'Create components',
  exporting: 'Package Penpot file'
};

export const ProgressStepper = ({ currentStep }: ProgressStepperProps): JSX.Element | null => {
  const currentStepIndex = PROGRESS_STEPS.indexOf(currentStep);

  if (currentStepIndex === -1) {
    return null;
  }

  return (
    <Stack space="2xsmall">
      <div className={styles['step-info']}>
        <strong>
          Step {currentStepIndex + 1} of {PROGRESS_STEPS.length}
        </strong>{' '}
        — {STEP_NAMES[currentStep]}
      </div>

      <Stack direction="column" space="3xsmall">
        {PROGRESS_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isNextStep = index > currentStepIndex;

          return (
            <div
              key={step}
              className={classNames(styles['step-item'], {
                [styles['step-item-active']]: isCurrent,
                [styles['step-item-next']]: isNextStep
              })}
            >
              {isCurrent ? (
                <Circle size={13} style={{ fill: 'var(--figma-color-text)' }} />
              ) : isCompleted ? (
                <CircleCheck size={13} />
              ) : (
                <Circle size={13} />
              )}
              {STEP_NAMES[step]}
            </div>
          );
        })}
      </Stack>
    </Stack>
  );
};
