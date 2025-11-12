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

// Safe default value to avoid overflowing from the screen
const MAX_HEIGHT = 800;

export const App = (): JSX.Element => {
  const { ref, height } = useResizeObserver<HTMLDivElement>({ box: 'border-box' });

  useEffect(() => {
    if (height === undefined) return;

    const capHeight = Math.min(height, MAX_HEIGHT);

    parent.postMessage({ pluginMessage: { type: 'resize', height: capHeight } }, '*');
  }, [height]);

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
            {__DEV__ && (
              <span
                style={{
                  alignSelf: 'center',
                  padding: '0.125rem 0.375rem',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  borderRadius: '0.25rem',
                  fontWeight: 'bold'
                }}
              >
                DEV
              </span>
            )}
            <PenpotExporter />
          </Stack>
        </Wrapper>
        <AppFooter />
      </PluginContainer>
    </FigmaProvider>
  );
};
