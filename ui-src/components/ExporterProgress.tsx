import { LoadingIndicator } from '@create-figma-plugin/ui';
import { useEffect, useState } from 'react';

import { Stack } from './Stack';

export const ExporterProgress = () => {
  const [currentNode, setCurrentNode] = useState<string | undefined>();
  const [totalPages, setTotalPages] = useState<number | undefined>();
  const [processedPages, setProcessedPages] = useState<number | undefined>();

  const onMessage = (event: MessageEvent<{ pluginMessage: { type: string; data: unknown } }>) => {
    if (event.data.pluginMessage?.type === 'PROGRESS_NODE') {
      setCurrentNode(event.data.pluginMessage.data as string);
    } else if (event.data.pluginMessage?.type === 'PROGRESS_TOTAL_PAGES') {
      setTotalPages(event.data.pluginMessage.data as number);
    } else if (event.data.pluginMessage?.type === 'PROGRESS_PROCESSED_PAGES') {
      setProcessedPages(event.data.pluginMessage.data as number);
    }
  };

  useEffect(() => {
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

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
        {processedPages} of {totalPages} pages exported 💪
        {currentNode ? (
          <>
            <br />
            Currently exporting layer
            <br />
            {'“' + truncateText(currentNode, 40) + '”'}
          </>
        ) : undefined}
      </span>
    </Stack>
  );
};
