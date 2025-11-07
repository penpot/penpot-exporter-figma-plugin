import { type PropsWithChildren, forwardRef } from 'preact/compat';

import styles from './Wrapper.module.css';

const Wrapper = forwardRef<HTMLDivElement, PropsWithChildren>(({ children }, ref) => {
  return (
    <div ref={ref} className={styles.wrapper}>
      {children}
    </div>
  );
});

Wrapper.displayName = 'Wrapper';

export { Wrapper };
