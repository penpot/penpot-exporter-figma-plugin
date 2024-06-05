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
  | PenpotDocumentMessage
  | CustomFontsMessage
  | ChangesDetectedMessage
  | ProgressNodeMessage
  | ProgressTotalPagesMessage
  | ProgressProcessedPagesMessage;

type PenpotDocumentMessage = {
  type: 'PENPOT_DOCUMENT';
  data: PenpotDocument;
};

type CustomFontsMessage = {
  type: 'CUSTOM_FONTS';
  data: string[];
};

type ChangesDetectedMessage = {
  type: 'CHANGES_DETECTED';
};

type ProgressNodeMessage = {
  type: 'PROGRESS_NODE';
  data: string;
};

type ProgressTotalPagesMessage = {
  type: 'PROGRESS_TOTAL_PAGES';
  data: number;
};

type ProgressProcessedPagesMessage = {
  type: 'PROGRESS_PROCESSED_PAGES';
  data: number;
};

export const useFigma = (): UseFigmaHook => {
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

  const onMessage = async (event: MessageEvent<{ pluginMessage?: PluginMessage }>) => {
    if (!event.data.pluginMessage) return;

    const { pluginMessage } = event.data;

    switch (pluginMessage.type) {
      case 'PENPOT_DOCUMENT': {
        setDownloading(true);

        const file = await parse(pluginMessage.data);

        file.export();
        break;
      }
      case 'CUSTOM_FONTS': {
        setMissingFonts(pluginMessage.data);
        setLoading(false);
        setNeedsReload(false);
        break;
      }
      case 'CHANGES_DETECTED': {
        setNeedsReload(true);
        break;
      }
      case 'PROGRESS_NODE': {
        setCurrentNode(pluginMessage.data);
        break;
      }
      case 'PROGRESS_TOTAL_PAGES': {
        setTotalPages(pluginMessage.data);
        setProcessedPages(0);
        break;
      }
      case 'PROGRESS_PROCESSED_PAGES': {
        setProcessedPages(pluginMessage.data);
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
