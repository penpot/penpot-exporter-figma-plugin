import classNames from 'classnames';
import type { JSX } from 'preact';

import { PROGRESS_STEPS, type Steps } from '@ui/types/progressMessages';

import styles from './ProgressStepper.module.css';

type ProgressStepperProps = {
  currentStep: Steps;
};

export const ProgressStepper = ({ currentStep }: ProgressStepperProps): JSX.Element | null => {
  const currentStepIndex = PROGRESS_STEPS.indexOf(currentStep);

  if (currentStepIndex === -1) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <strong
        className={styles.prefix}
      >{`Step ${currentStepIndex + 1} of ${PROGRESS_STEPS.length}`}</strong>
      <div className={styles.container}>
        <div className={styles.steps} role="list">
          {PROGRESS_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step}
                className={classNames(styles.step, {
                  [styles['step-completed']]: isCompleted,
                  [styles['step-current']]: isCurrent
                })}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
