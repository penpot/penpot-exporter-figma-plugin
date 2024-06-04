import { useEffect, useState } from 'react';

import { FormValues } from '@ui/components/ExportForm';
import { parse } from '@ui/parser';
import { PenpotDocument } from '@ui/types';

export type UseFigmaHook = {
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

type PluginMessage =
  | PenpotDocument
  | CustomFonts
  | ChangesDetected
  | ProgressNode
  | ProgressTotalPages
  | ProgressProcessedPages;

type CustomFonts = {
  type: 'CUSTOM_FONTS';
  data: string[];
};

type ChangesDetected = {
  type: 'CHANGES_DETECTED';
};

type ProgressNode = {
  type: 'PROGRESS_NODE';
  data: string;
};

type ProgressTotalPages = {
  type: 'PROGRESS_TOTAL_PAGES';
  data: number;
};

type ProgressProcessedPages = {
  type: 'PROGRESS_PROCESSED_PAGES';
  data: number;
};

const useFigma = (): UseFigmaHook => {
  const [missingFonts, setMissingFonts] = useState<string[]>();
  const [needsReload, setNeedsReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentNode, setCurrentNode] = useState<string | undefined>();
  const [totalPages, setTotalPages] = useState<number | undefined>();
  const [processedPages, setProcessedPages] = useState<number | undefined>();

  const postMessage = (type: string, data?: unknown) => {
    parent.postMessage({ pluginMessage: { type, data } }, '*');
  };

  const onMessage = (event: MessageEvent<{ pluginMessage?: PluginMessage }>) => {
    if (!event.data.pluginMessage) return;

    const { type, data } = event.data.pluginMessage;

    switch (type) {
      case 'PENPOT_DOCUMENT': {
        setDownloading(true);

        const file = parse(data as PenpotDocument);

        file.export();
        break;
      }
      case 'CUSTOM_FONTS': {
        setMissingFonts(data as string[]);
        setLoading(false);
        setNeedsReload(false);
        break;
      }
      case 'CHANGES_DETECTED': {
        setNeedsReload(true);
        break;
      }
      case 'PROGRESS_NODE': {
        setCurrentNode(data as string);
        break;
      }
      case 'PROGRESS_TOTAL_PAGES': {
        setTotalPages(data as number);
        setProcessedPages(0);
        break;
      }
      case 'PROGRESS_PROCESSED_PAGES': {
        setProcessedPages(data as number);
        break;
      }
    }
  };

  const reload = () => {
    setLoading(true);
    postMessage('reload');
  };

  const cancel = () => {
    postMessage('cancel');
  };

  const exportPenpot = (data: FormValues) => {
    setExporting(true);

    postMessage('export', data);
  };

  useEffect(() => {
    window.addEventListener('message', onMessage);

    postMessage('ready');

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  return {
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
  };
};

export { useFigma };
