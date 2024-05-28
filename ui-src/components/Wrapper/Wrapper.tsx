import classNames from 'classnames';
import { CSSProperties, PropsWithChildren, forwardRef } from 'react';

import styles from './Wrapper.module.css';

type WrapperProps = PropsWithChildren & {
  style?: CSSProperties;
  overflowing?: boolean;
};

const Wrapper = forwardRef<HTMLDivElement, WrapperProps>(
  ({ style, overflowing = false, children }: WrapperProps, ref) => {
    return (
      <div
        ref={ref}
        className={classNames({ [styles.wrapper]: true, [styles.wrapperOverflow]: overflowing })}
        style={style}
      >
        {children}
      </div>
    );
  }
);

Wrapper.displayName = 'Wrapper';

export { Wrapper };
