import type { JSX } from 'preact';
import type { PropsWithChildren } from 'preact/compat';

import styles from './TwoColumnLayout.module.css';

type TwoColumnLayoutProps = PropsWithChildren<{
  left: JSX.Element;
  right: JSX.Element;
}>;

export const TwoColumnLayout = ({ left, right }: TwoColumnLayoutProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </div>
  );
};
