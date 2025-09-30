import type { CSSProperties } from 'preact';
import { type PropsWithChildren, forwardRef } from 'preact/compat';

import styles from './Wrapper.module.css';

type WrapperProps = PropsWithChildren & {
  style?: CSSProperties;
  overflowing?: boolean;
};

const Wrapper = forwardRef<HTMLDivElement, WrapperProps>(
  ({ style, overflowing = false, children }: WrapperProps, ref) => {
    return (
      <div ref={ref} className={styles.wrapper} style={style} data-overflowing={overflowing}>
        {children}
      </div>
    );
  }
);

Wrapper.displayName = 'Wrapper';

export { Wrapper };
