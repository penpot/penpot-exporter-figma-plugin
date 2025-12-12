import type { JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import useResizeObserver from 'use-resize-observer';

import Penpot from '@ui/assets/penpot.svg?react';
import { AppFooter } from '@ui/components/AppFooter';
import { PenpotExporter } from '@ui/components/PenpotExporter';
import { PluginContainer } from '@ui/components/PluginContainer';
import { Stack } from '@ui/components/Stack';
import { Wrapper } from '@ui/components/Wrapper';
import { FigmaProvider } from '@ui/context/FigmaContext';

declare const __DEV__: boolean;

// Safe default values to avoid overflowing from the screen
const MAX_HEIGHT = 800;
const TARGET_WIDTH = 560;

export const App = (): JSX.Element => {
  const { ref, width, height } = useResizeObserver<HTMLDivElement>({ box: 'border-box' });

  useEffect(() => {
    if (height === undefined || width === undefined) return;

    const capHeight = Math.min(height, MAX_HEIGHT);
    const targetWidth = Math.max(width, TARGET_WIDTH);

    parent.postMessage(
      { pluginMessage: { type: 'resize', width: targetWidth, height: capHeight } },
      '*'
    );
  }, [width, height]);

  return (
    <FigmaProvider>
      <PluginContainer ref={ref} overflowing={(height ?? 0) > MAX_HEIGHT}>
        <Wrapper>
          <Stack>
            <Penpot
              style={{
                alignSelf: 'center',
                height: 'auto',
                width: '8.125rem',
                fill: 'var(--figma-color-icon)'
              }}
            />
            <PenpotExporter />
          </Stack>
        </Wrapper>
        <AppFooter />
      </PluginContainer>
    </FigmaProvider>
  );
};
