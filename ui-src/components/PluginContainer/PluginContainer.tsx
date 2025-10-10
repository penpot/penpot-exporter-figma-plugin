import type { CSSProperties } from 'preact';
import { type PropsWithChildren, forwardRef } from 'preact/compat';

type PluginContainerProps = PropsWithChildren & {
  style?: CSSProperties;
  overflowing?: boolean;
};

const PluginContainer = forwardRef<HTMLDivElement, PluginContainerProps>(
  ({ style, overflowing = false, children }: PluginContainerProps, ref) => {
    return (
      <div ref={ref} style={style} data-overflowing={overflowing}>
        {children}
      </div>
    );
  }
);

PluginContainer.displayName = 'PluginContainer';

export { PluginContainer };
