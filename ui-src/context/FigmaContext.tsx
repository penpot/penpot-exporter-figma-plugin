import { JSX, PropsWithChildren, useEffect, useState } from 'react';

import { FormValues } from '@ui/components/ExportForm';
import { parse } from '@ui/parser';
import { PenpotDocument } from '@ui/types';

import { createGenericContext } from './createGenericContext';

type Context = {
  missingFonts: string[] | undefined;
  needsReload: boolean;
  loading: boolean;
  exporting: boolean;
  downloading: boolean;
  currentNode: string | undefined;
  totalPages: number | undefined;
  processedPages: number | undefined;
  reload: () => void;
  cancel: () => void;
  exportPenpot: (data: FormValues) => void;
};

const [useFigma, StateContextProvider] = createGenericContext<Context>();

const FigmaProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [missingFonts, setMissingFonts] = useState<string[]>();
  const [needsReload, setNeedsReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentNode, setCurrentNode] = useState<string | undefined>();
  const [totalPages, setTotalPages] = useState<number | undefined>();
  const [processedPages, setProcessedPages] = useState<number | undefined>();

  const onMessage = (event: MessageEvent<{ pluginMessage: { type: string; data: unknown } }>) => {
    if (event.data.pluginMessage?.type == 'PENPOT_DOCUMENT') {
      setDownloading(true);

      const document = event.data.pluginMessage.data as PenpotDocument;
      const file = parse(document);

      file.export();
    } else if (event.data.pluginMessage?.type == 'CUSTOM_FONTS') {
      setMissingFonts(event.data.pluginMessage.data as string[]);
      setLoading(false);
      setNeedsReload(false);
    } else if (event.data.pluginMessage?.type == 'CHANGES_DETECTED') {
      setNeedsReload(true);
    } else if (event.data.pluginMessage?.type === 'PROGRESS_NODE') {
      setCurrentNode(event.data.pluginMessage.data as string);
    } else if (event.data.pluginMessage?.type === 'PROGRESS_TOTAL_PAGES') {
      setTotalPages(event.data.pluginMessage.data as number);
      setProcessedPages(0);
    } else if (event.data.pluginMessage?.type === 'PROGRESS_PROCESSED_PAGES') {
      setProcessedPages(event.data.pluginMessage.data as number);
    }
  };

  const reload = () => {
    setLoading(true);
    parent.postMessage({ pluginMessage: { type: 'reload' } }, '*');
  };

  const cancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  const exportPenpot = (data: FormValues) => {
    setExporting(true);

    parent.postMessage(
      {
        pluginMessage: {
          type: 'export',
          data
        }
      },
      '*'
    );
  };

  useEffect(() => {
    window.addEventListener('message', onMessage);

    parent.postMessage({ pluginMessage: { type: 'ready' } }, '*');

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  return (
    <StateContextProvider
      value={{
        missingFonts,
        needsReload,
        loading,
        exporting,
        downloading,
        currentNode,
        totalPages,
        processedPages,
        reload,
        cancel,
        exportPenpot
      }}
    >
      {children}
    </StateContextProvider>
  );
};

export { FigmaProvider, useFigma };
