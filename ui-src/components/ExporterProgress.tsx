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
  processing: {
    total: 'pages processed 💪',
    current: 'Currently processing layer'
  },
  images: {
    total: 'Images downloaded 📸'
  },
  optimization: {
    total: 'Images optimized 📸'
  },
  building: {
    total: 'Pages built 🏗️'
  },
  fills: {
    total: 'Fetching color libraries 🎨'
  },
  colorLibraries: {
    total: 'Building color libraries 🎨'
  },
  components: {
    total: 'Components built 🏗️'
  },
  exporting: {
    total: 'Penpot file generated 🚀'
  },
  typographies: {
    total: 'Fetching text libraries 📝'
  },
  typoLibraries: {
    total: 'Building text libraries 📝'
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
    case 'fills':
    case 'typographies':
    case 'colorLibraries':
    case 'typoLibraries':
      return <>{stepMessages[step].total}</>;
    case 'processing':
      return (
        <>
          {`${progress.processedItems} of ${progress.totalItems}`} {stepMessages[step].total}
          <br />
          {currentText}
          <br />
          {'“' + truncateText(progress.currentItem, 35) + '”'}
        </>
      );
    case 'images':
    case 'optimization':
    case 'building':
    case 'components':
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
