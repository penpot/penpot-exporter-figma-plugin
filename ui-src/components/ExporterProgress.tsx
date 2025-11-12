import { LoadingIndicator } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';
import type { Steps } from '@ui/types/progressMessages';

type Messages = {
  total: string;
  current?: string;
};

const stepMessages: Record<Steps, Messages> = {
  tokens: {
    total: 'Processing tokens 📝'
  },
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
  const { progress, progressPercentage, step } = useFigmaContext();

  const truncateText = (text: string, maxChars: number): string => {
    if (text.length <= maxChars) {
      return text;
    }

    return text.slice(0, maxChars) + '...';
  };

  if (!step) return null;

  const currentText = stepMessages[step].current;

  switch (step) {
    case 'tokens':
    case 'processing':
    case 'images':
    case 'optimization':
    case 'building':
    case 'fills':
    case 'components':
    case 'colorLibraries':
    case 'typographies':
    case 'typoLibraries':
      return (
        <>
          {progress.totalItems > 0 ? `${progress.processedItems} of ${progress.totalItems}` : ''}{' '}
          {stepMessages[step].total}
          {progress.currentItem && currentText ? (
            <>
              <br />
              {currentText}
              <br />
              {'“' + truncateText(progress.currentItem, 35) + '”'}
            </>
          ) : undefined}
        </>
      );
    case 'exporting':
      return (
        <>
          {progressPercentage}% {stepMessages[step].total}
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
