import type { JSX } from 'preact';

import styles from './ProgressBar.module.css';

type ProgressBarProps = {
  value: number;
};

export const ProgressBar = ({ value }: ProgressBarProps): JSX.Element => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={styles['progress-bar']} role="progressbar">
      <div className={styles['progress-bar-track']}>
        <div className={styles['progress-bar-fill']} style={{ width: `${clampedValue}%` }} />
      </div>
    </div>
  );
};
