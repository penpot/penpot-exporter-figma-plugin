import { exportAsBytes } from '@penpot/library';
import { useEffect, useState } from 'react';

import { FormValues } from '@ui/components/ExportForm';
import { MessageData, sendMessage } from '@ui/context/messages';
import { identify, track } from '@ui/metrics/mixpanel';
import { parse } from '@ui/parser';

export type UseFigmaHook = {
  missingFonts: string[] | undefined;
  needsReload: boolean;
  loading: boolean;
  exporting: boolean;
  error: boolean;
  step: Steps | undefined;
  currentItem: string | undefined;
  totalItems: number;
  processedItems: number;
  reload: () => void;
  cancel: () => void;
  exportPenpot: (data: FormValues) => void;
};

export type Steps =
  | 'processing'
  | 'images'
  | 'optimization'
  | 'building'
  | 'components'
  | 'exporting'
  | 'fills'
  | 'format'
  | 'libraries'
  | 'typographies'
  | 'typoFormat'
  | 'typoLibraries';

export const useFigma = (): UseFigmaHook => {
  const [missingFonts, setMissingFonts] = useState<string[]>();
  const [needsReload, setNeedsReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(false);

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
      case 'USER_DATA': {
        identify({ userId: pluginMessage.data.userId });
        track('Plugin Loaded');
        break;
      }
      case 'PENPOT_DOCUMENT': {
        const context = await parse(pluginMessage.data);

        sendMessage({
          type: 'PROGRESS_STEP',
          data: 'exporting'
        });

        // Override console.log to capture progress messages
        const originalConsoleLog = console.log;
        console.log = (message: string, params: unknown) => {
          if (message === 'export') {
            if (params && typeof params === 'string') {
              setCurrentItem(params.split('/').pop());
            }
          }
        };

        const binary = await exportAsBytes(context);

        if (binary) {
          const blob = new Blob([binary], { type: 'application/zip' });
          download(blob, `${pluginMessage.data.name}.penpot`);

          // get size of the file in Mb rounded to 2 decimal places
          const size = Math.round((binary.length / 1024 / 1024) * 100) / 100;
          track('File Exported', { 'Exported File Size': size + ' Mb' });
        }

        setExporting(false);
        setStep(undefined);

        // Restore console.log
        console.log = originalConsoleLog;

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
      case 'ERROR': {
        setError(true);
        setLoading(false);
        setExporting(false);
        track('Error', { 'Error Message': pluginMessage.data });
        throw new Error(pluginMessage.data);
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
    setError(false);
    postMessage('reload');
  };

  const cancel = () => {
    postMessage('cancel');
  };

  const exportPenpot = () => {
    setExporting(true);
    setStep('processing');
    setProcessedItems(0);

    postMessage('export');
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
    error,
    step,
    currentItem,
    totalItems,
    processedItems,
    reload,
    cancel,
    exportPenpot
  };
};
