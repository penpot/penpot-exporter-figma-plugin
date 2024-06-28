import { LoadingIndicator } from '@create-figma-plugin/ui';
import { JSX } from 'react';

import { Steps, useFigmaContext } from '@ui/context';

import { Stack } from './Stack';

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
  format: {
    total: 'formatting color libraries 🎨'
  },
  libraries: {
    total: 'color libraries built 🎨'
  },
  components: {
    total: 'components built 🏗️',
    current: 'Currently processing layer'
  },
  exporting: {
    total: 'Generating Penpot file 🚀',
    current: 'Please wait, this process might take a while...'
  },
  typographies: {
    total: 'text styles fetched 📝'
  },
  typoFormat: {
    total: 'formatting text styles 📝'
  },
  typoLibraries: {
    total: 'text styles built 📝'
  }
};

const StepProgress = (): JSX.Element | null => {
  const { currentItem, totalItems, processedItems, step } = useFigmaContext();

  const truncateText = (text: string, maxChars: number) => {
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
    case 'format':
    case 'libraries':
    case 'typographies':
    case 'typoFormat':
    case 'typoLibraries':
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
    case 'exporting':
      return (
        <>
          {stepMessages[step].total}
          <br />
          {currentText}
        </>
      );
  }
};

export const ExporterProgress = () => {
  return (
    <Stack space="small" horizontalAlign="center">
      <LoadingIndicator />
      <span style={{ textAlign: 'center' }}>
        <StepProgress />
      </span>
    </Stack>
  );
};
