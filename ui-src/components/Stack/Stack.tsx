import classNames from 'classnames';
import { CSSProperties, PropsWithChildren } from 'react';

import styles from './Stack.module.css';

type StackProps = PropsWithChildren & {
  space?: 'medium' | 'small' | 'xsmall' | '2xsmall';
  direction?: 'column' | 'row';
  horizontalAlign?: 'start' | 'center';
  style?: CSSProperties;
  as?: 'div' | 'ol';
};

export const Stack = ({
  space = 'medium',
  direction = 'column',
  horizontalAlign = 'start',
  style,
  as = 'div',
  children
}: StackProps) => {
  const Tag = as;

  return (
    <Tag
      className={classNames({
        [styles.stack]: true,
        [styles[`stack-${space}`]]: space !== 'medium',
        [styles[`stack-${direction}`]]: direction !== 'column',
        [styles[`stack-${horizontalAlign}`]]: horizontalAlign !== 'start'
      })}
      style={style}
    >
      {children}
    </Tag>
  );
};
