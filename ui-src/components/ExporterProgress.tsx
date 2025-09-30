import { LoadingIndicator } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';

import { Stack } from '@ui/components/Stack';
import { type Steps, useFigmaContext } from '@ui/context';

type Messages = {
  total: string;
  current?: string;
};

const stepMessages: Record<Steps, Messages> = {
  processing: {
    total: 'pages processed 💪',
    current: 'Currently processing layer'
  },
  images: {
    total: 'images downloaded 📸'
  },
  optimization: {
    total: 'images optimized 📸'
  },
  building: {
    total: 'pages built 🏗️',
    current: 'Currently processing layer'
  },
  fills: {
    total: 'color libraries fetched 🎨'
  },
  colorLibraries: {
    total: 'color libraries built 🎨'
  },
  components: {
    total: 'components built 🏗️',
    current: 'Currently processing layer'
  },
  exporting: {
    total: 'Penpot file generated 🚀',
    current: 'Currently exporting item'
  },
  typographies: {
    total: 'text libraries fetched 📝'
  },
  typoLibraries: {
    total: 'text libraries built 📝'
  }
};

const StepProgress = (): JSX.Element | null => {
  const { currentItem, totalItems, processedItems, step } = useFigmaContext();

  const truncateText = (text: string, maxChars: number): string => {
    if (text.length <= maxChars) {
      return text;
    }

    return text.slice(0, maxChars) + '...';
  };

  if (!step) return null;

  const currentText = stepMessages[step].current;

  switch (step) {
    case 'processing':
    case 'images':
    case 'optimization':
    case 'building':
    case 'fills':
    case 'components':
    case 'colorLibraries':
    case 'typographies':
    case 'typoLibraries':
    case 'exporting':
      return (
        <>
          {processedItems} of {totalItems} {stepMessages[step].total}
          {currentItem && currentText ? (
            <>
              <br />
              {currentText}
              <br />
              {'“' + truncateText(currentItem, 35) + '”'}
            </>
          ) : undefined}
        </>
      );
  }
};

export const ExporterProgress = (): JSX.Element => {
  return (
    <Stack space="small" horizontalAlign="center">
      <LoadingIndicator />
      <span style={{ textAlign: 'center' }}>
        <StepProgress />
      </span>
    </Stack>
  );
};
