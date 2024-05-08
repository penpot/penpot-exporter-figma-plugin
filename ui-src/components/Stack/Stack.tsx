import classNames from 'classnames';
import { CSSProperties, ReactNode } from 'react';

import styles from './Stack.module.css';

type StackProps = {
  space?: 'medium' | 'small' | 'extra-small';
  direction?: 'column' | 'row';
  horizontalAlign?: 'start' | 'center';
  style?: CSSProperties;
  as?: 'div' | 'ol';
  children: ReactNode;
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
