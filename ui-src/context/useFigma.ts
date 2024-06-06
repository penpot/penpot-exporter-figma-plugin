import { useEffect, useState } from 'react';

import { FormValues } from '@ui/components/ExportForm';
import { parse } from '@ui/parser';

import { MessageData } from '.';

export type UseFigmaHook = {
  missingFonts: string[] | undefined;
  needsReload: boolean;
  loading: boolean;
  exporting: boolean;
  step: Steps | undefined;
  currentItem: string | undefined;
  totalItems: number;
  processedItems: number;
  reload: () => void;
  cancel: () => void;
  exportPenpot: (data: FormValues) => void;
};

export type Steps = 'processing' | 'remote' | 'images' | 'optimization' | 'downloading';

export const useFigma = (): UseFigmaHook => {
  const [missingFonts, setMissingFonts] = useState<string[]>();
  const [needsReload, setNeedsReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [step, setStep] = useState<Steps>();
  const [currentItem, setCurrentItem] = useState<string | undefined>();
  const [totalItems, setTotalItems] = useState<number>(0);
  const [processedItems, setProcessedItems] = useState<number>(0);

  const postMessage = (type: string, data?: unknown) => {
    parent.postMessage({ pluginMessage: { type, data } }, '*');
  };

  const onMessage = async (event: MessageEvent<MessageData>) => {
    if (!event.data.pluginMessage) return;

    const { pluginMessage } = event.data;

    switch (pluginMessage.type) {
      case 'PENPOT_DOCUMENT': {
        const file = await parse(pluginMessage.data);
        const blob = await file.export();

        download(blob, `${pluginMessage.data.name}.zip`);

        setExporting(false);
        setStep(undefined);

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
      case 'PROGRESS_STEP': {
        setStep(pluginMessage.data);
        setProcessedItems(0);
        break;
      }
      case 'PROGRESS_CURRENT_ITEM': {
        setCurrentItem(pluginMessage.data);
        break;
      }
      case 'PROGRESS_TOTAL_ITEMS': {
        setTotalItems(pluginMessage.data);
        break;
      }
      case 'PROGRESS_PROCESSED_ITEMS': {
        setProcessedItems(pluginMessage.data);
        break;
      }
    }
  };

  const download = (blob: Blob, name: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = name;

    a.click();
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
    setStep('processing');
    setProcessedItems(0);

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
    step,
    currentItem,
    totalItems,
    processedItems,
    reload,
    cancel,
    exportPenpot
  };
};
