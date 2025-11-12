import { type PropsWithChildren, forwardRef } from 'preact/compat';

type PluginContainerProps = PropsWithChildren<{
  overflowing?: boolean;
}>;

const PluginContainer = forwardRef<HTMLDivElement, PluginContainerProps>(
  ({ overflowing = false, children }, ref) => {
    return (
      <div ref={ref} data-overflowing={overflowing}>
        {children}
      </div>
    );
  }
);

PluginContainer.displayName = 'PluginContainer';

export { PluginContainer };
