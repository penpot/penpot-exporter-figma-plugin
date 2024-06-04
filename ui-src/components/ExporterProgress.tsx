import { LoadingIndicator } from '@create-figma-plugin/ui';

import { useFigma } from '@ui/context';

import { Stack } from './Stack';

export const ExporterProgress = () => {
  const { currentNode, totalPages, processedPages, downloading } = useFigma();

  const truncateText = (text: string, maxChars: number) => {
    if (text.length <= maxChars) {
      return text;
    }

    return text.slice(0, maxChars) + '...';
  };

  return (
    <Stack space="small" horizontalAlign="center">
      <LoadingIndicator />
      <span style={{ textAlign: 'center' }}>
        {!downloading ? (
          <>
            {processedPages} of {totalPages} pages exported 💪
            {currentNode ? (
              <>
                <br />
                Currently exporting layer
                <br />
                {'“' + truncateText(currentNode, 35) + '”'}
              </>
            ) : undefined}
          </>
        ) : (
          <>
            Generating Penpot file 🚀
            <br />
            Please wait, this process might take a while...
          </>
        )}
      </span>
    </Stack>
  );
};
