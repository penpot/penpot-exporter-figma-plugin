import type { JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import useResizeObserver from 'use-resize-observer';

import Penpot from '@ui/assets/penpot.svg?react';
import { AppFooter } from '@ui/components/AppFooter';
import { PenpotExporter } from '@ui/components/PenpotExporter';
import { PluginContainer } from '@ui/components/PluginContainer';
import { Stack } from '@ui/components/Stack';
import { Wrapper } from '@ui/components/Wrapper';
import { FigmaProvider, useFigmaContext } from '@ui/context/FigmaContext';

declare const __DEV__: boolean;

// Safe default values to avoid overflowing from the screen
const MAX_HEIGHT = 800;
const WIDE_WIDTH = 560; // For ExportForm with two-column layout
const NARROW_WIDTH = 290; // For other views (ExportSummary, ExporterProgress, LibraryError)

const AppContent = (): JSX.Element => {
  const { ref, width, height } = useResizeObserver<HTMLDivElement>({ box: 'border-box' });
  const { exporting, summary, error } = useFigmaContext();

  // Use wide width only for ExportForm (when not exporting, not summary, and not error)
  const isExportForm = !exporting && !summary && !error;
  const targetWidth = isExportForm ? WIDE_WIDTH : NARROW_WIDTH;

  useEffect(() => {
    if (height === undefined || width === undefined) return;

    const capHeight = Math.min(height, MAX_HEIGHT);

    parent.postMessage(
      { pluginMessage: { type: 'resize', width: targetWidth, height: capHeight } },
      '*'
    );
  }, [width, height, targetWidth]);

  return (
    <PluginContainer ref={ref} overflowing={(height ?? 0) > MAX_HEIGHT}>
      <Wrapper>
        <Stack>
          <Penpot
            style={{
              alignSelf: 'flex-start',
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
  );
};

export const App = (): JSX.Element => {
  return (
    <FigmaProvider>
      <AppContent />
    </FigmaProvider>
  );
};
