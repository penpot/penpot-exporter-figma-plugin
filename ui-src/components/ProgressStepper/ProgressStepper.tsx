import classNames from 'classnames';
import type { JSX } from 'preact';

import { PROGRESS_STEPS, type Steps } from '@ui/types/progressMessages';

import styles from './ProgressStepper.module.css';

type ProgressStepperProps = {
  currentStep: Steps;
};

const humanizeStepName = (step: Steps): string => {
  return step.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, char => char.toUpperCase());
};

export const ProgressStepper = ({ currentStep }: ProgressStepperProps): JSX.Element => {
  const computedIndex = PROGRESS_STEPS.indexOf(currentStep);
  const isKnownStep = computedIndex !== -1;
  const currentIndex = isKnownStep ? computedIndex : 0;
  const stepIndex = PROGRESS_STEPS.indexOf(currentStep);
  const stepNumber = stepIndex !== -1 ? stepIndex + 1 : undefined;
  const stepPrefix = stepNumber ? `Step ${stepNumber} of ${PROGRESS_STEPS.length}` : undefined;

  return (
    <div className={styles.wrapper}>
      {stepPrefix && <strong className={styles.prefix}>{stepPrefix}</strong>}
      <div className={styles.container}>
        <div className={styles.steps} role="list">
          {PROGRESS_STEPS.map((step, index) => {
            const isCompleted = isKnownStep && index < currentIndex;
            const isCurrent = isKnownStep && index === currentIndex;

            return (
              <div
                key={step}
                className={classNames(styles.step, {
                  [styles['step-completed']]: isCompleted,
                  [styles['step-current']]: isCurrent
                })}
                role="listitem"
                title={`${index + 1}. ${humanizeStepName(step)}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
