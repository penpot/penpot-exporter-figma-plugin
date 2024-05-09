import { CSSProperties, ReactNode } from 'react';

import styles from './Wrapper.module.css';

type WrapperProps = {
  style?: CSSProperties;
  children: ReactNode;
};

export const Wrapper = ({ style, children }: WrapperProps) => {
  return (
    <div className={styles.wrapper} style={style}>
      {children}
    </div>
  );
};
