import { useEffect } from 'react';
import useResizeObserver from 'use-resize-observer';

import Penpot from '@ui/assets/penpot.svg?react';
import { PenpotExporter } from '@ui/components/PenpotExporter';
import { Stack } from '@ui/components/Stack';
import { Wrapper } from '@ui/components/Wrapper';
import { FigmaProvider } from '@ui/context/FigmaContext';

// Safe default value to avoid overflowing from the screen
const MAX_HEIGHT = 800;

export const App = () => {
  const { ref, height } = useResizeObserver<HTMLDivElement>({ box: 'border-box' });

  useEffect(() => {
    if (height === undefined) return;

    const capHeight = Math.min(height, MAX_HEIGHT);

    parent.postMessage({ pluginMessage: { type: 'resize', height: capHeight } }, '*');
  }, [height]);

  return (
    <FigmaProvider>
      <Wrapper ref={ref} overflowing={(height ?? 0) > MAX_HEIGHT}>
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
    </FigmaProvider>
  );
};
