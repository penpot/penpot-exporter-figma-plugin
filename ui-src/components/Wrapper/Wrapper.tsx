import { CSSProperties, PropsWithChildren } from 'react';

import styles from './Wrapper.module.css';

type WrapperProps = PropsWithChildren & {
  style?: CSSProperties;
};

export const Wrapper = ({ style, children }: WrapperProps) => {
  return (
    <div className={styles.wrapper} style={style}>
      {children}
    </div>
  );
};
