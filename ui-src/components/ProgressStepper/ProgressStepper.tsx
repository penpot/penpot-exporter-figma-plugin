import classNames from 'classnames';
import { Circle, CircleCheck } from 'lucide-react';
import type { JSX } from 'preact';

import { Stack } from '@ui/components/Stack';
import { PROGRESS_STEPS, type Steps } from '@ui/types';

import styles from './ProgressStepper.module.css';

type ProgressStepperProps = {
  currentStep: Steps;
  currentStepName?: string;
};

const STEP_NAMES: Record<Steps, string> = {
  processing: 'Scan Figma pages',
  processAssets: 'Gather linked assets',
  buildAssets: 'Build Penpot assets',
  building: 'Assemble Penpot pages',
  components: 'Create components',
  exporting: 'Package Penpot file'
};

export const ProgressStepper = ({
  currentStep,
  currentStepName
}: ProgressStepperProps): JSX.Element | null => {
  const currentStepIndex = PROGRESS_STEPS.indexOf(currentStep);

  if (currentStepIndex === -1) {
    return null;
  }

  const activeStepName = currentStepName ?? STEP_NAMES[currentStep];

  return (
    <Stack space="2xsmall">
      <div className={styles['step-info']}>
        <strong>
          Step {currentStepIndex + 1} of {PROGRESS_STEPS.length}
        </strong>{' '}
        — {activeStepName}
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
              {isCurrent ? activeStepName : STEP_NAMES[step]}
            </div>
          );
        })}
      </Stack>
    </Stack>
  );
};
