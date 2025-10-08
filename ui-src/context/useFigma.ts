import { exportStream } from '@penpot/library';
import { useEffect, useState } from 'preact/hooks';

import type { FormValues } from '@ui/components/ExportForm';
import { type MessageData, createInMemoryWritable, sendMessage } from '@ui/context';
import { identify, track } from '@ui/metrics/mixpanel';
import { parse } from '@ui/parser';

export type UseFigmaHook = {
  missingFonts: string[] | undefined;
  needsReload: boolean;
  loading: boolean;
  exporting: boolean;
  error: boolean;
  step: Steps | undefined;
  progress: {
    currentItem: string | undefined;
    totalItems: number;
    processedItems: number;
  };
  progressPercentage: number;
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
  | 'colorLibraries'
  | 'typographies'
  | 'typoLibraries';

export const useFigma = (): UseFigmaHook => {
  const [missingFonts, setMissingFonts] = useState<string[]>();
  const [needsReload, setNeedsReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(false);

  const [step, setStep] = useState<Steps>();
  const [progress, setProgress] = useState<{
    currentItem: string | undefined;
    totalItems: number;
    processedItems: number;
  }>({
    currentItem: undefined,
    totalItems: 0,
    processedItems: 0
  });
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  const postMessage = (type: string, data?: unknown): void => {
    parent.postMessage({ pluginMessage: { type, data } }, '*');
  };

  const onMessage = async (event: MessageEvent<MessageData>): Promise<void> => {
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

        const { writable, getBlob } = createInMemoryWritable();

        await exportStream(context, writable, {
          onProgress: ({ item, total }) => {
            const percentage = Math.round((item / total) * 100);

            setProgressPercentage(percentage);
          }
        });

        const blob = getBlob();

        download(blob, `${pluginMessage.data.name}.penpot`);

        // get size of the file in Mb rounded to 2 decimal places
        const size = Math.round((blob.size / 1024 / 1024) * 100) / 100;
        track('File Exported', { 'Exported File Size': size + ' Mb' });

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
        setProgress(prev => ({
          currentItem: prev.currentItem,
          totalItems: prev.totalItems,
          processedItems: 0
        }));

        break;
      }
      case 'PROGRESS_CURRENT_ITEM': {
        setProgress(prev => ({
          currentItem: pluginMessage.data,
          totalItems: prev.totalItems,
          processedItems: prev.processedItems
        }));

        break;
      }
      case 'PROGRESS_TOTAL_ITEMS': {
        setProgress(prev => ({
          currentItem: prev.currentItem,
          totalItems: pluginMessage.data,
          processedItems: prev.processedItems
        }));

        break;
      }
      case 'PROGRESS_PROCESSED_ITEMS': {
        setProgress(prev => ({
          currentItem: prev.currentItem,
          totalItems: prev.totalItems,
          processedItems: pluginMessage.data
        }));

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

  const download = (blob: Blob, name: string): void => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = name;

    a.click();
  };

  const reload = (): void => {
    setLoading(true);
    setError(false);
    postMessage('reload');
  };

  const cancel = (): void => {
    postMessage('cancel');
  };

  const exportPenpot = (): void => {
    setExporting(true);
    setStep('processing');
    setProgress(prev => ({
      currentItem: prev.currentItem,
      totalItems: prev.totalItems,
      processedItems: 0
    }));

    postMessage('export');
  };

  useEffect(() => {
    window.addEventListener('message', onMessage);

    postMessage('ready');

    return (): void => {
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
    progress,
    progressPercentage,
    reload,
    cancel,
    exportPenpot
  };
};
