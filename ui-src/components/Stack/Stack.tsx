import classNames from 'classnames';
import type { CSSProperties, JSX } from 'preact';
import type { PropsWithChildren } from 'preact/compat';

import styles from './Stack.module.css';

type StackProps = PropsWithChildren<{
  space?: 'medium' | 'small' | 'xsmall' | '2xsmall';
  direction?: 'column' | 'row';
  horizontalAlign?: 'start' | 'center';
  style?: CSSProperties;
  as?: 'div' | 'ol';
}>;

export const Stack = ({
  space = 'medium',
  direction = 'column',
  horizontalAlign = 'start',
  style,
  as = 'div',
  children
}: StackProps): JSX.Element => {
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
