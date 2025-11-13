import type { JSX } from 'preact';

import styles from './ProgressBar.module.css';

type ProgressBarProps = {
  value: number;
};

export const ProgressBar = ({ value }: ProgressBarProps): JSX.Element => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={styles['progress-bar']} role="progressbar">
      <svg className={styles['progress-bar-svg']} viewBox="0 0 50 50">
        <circle className={styles['progress-bar-track']} cx="25" cy="25" r={radius} fill="none" />
        <circle
          className={styles['progress-bar-fill']}
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 25 25)"
        />
      </svg>
    </div>
  );
};
