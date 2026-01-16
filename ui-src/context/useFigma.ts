import { exportStream } from '@penpot/library';
import { useEffect, useRef, useState } from 'preact/hooks';

import { type MessageData, createInMemoryWritable, sendMessage } from '@ui/context';
import { identify, track } from '@ui/metrics/mixpanel';
import { parse } from '@ui/parser';
import type { ExportScope, Steps } from '@ui/types/progressMessages';
import { formatExportTime } from '@ui/utils';
import { fileSizeInMB } from '@ui/utils/fileSizeInMB';

export type UseFigmaHook = {
  missingFonts: string[] | undefined;
  exporting: boolean;
  summary: boolean;
  error: boolean;
  step: Steps;
  progress: {
    currentItem: string;
    totalItems: number;
    processedItems: number;
  };
  progressPercentage: number;
  exportedBlob: { blob: Blob; filename: string } | null;
  exportTime: number | null;
  exportScope: ExportScope;
  setExportScope: (scope: ExportScope) => void;
  retry: () => void;
  cancel: () => void;
  exportPenpot: () => void;
  downloadBlob: () => void;
};

export const useFigma = (): UseFigmaHook => {
  const [missingFonts, setMissingFonts] = useState<string[]>();
  const [exporting, setExporting] = useState(false);
  const [summary, setSummary] = useState(false);
  const [error, setError] = useState(false);
  const [exportedBlob, setExportedBlob] = useState<{ blob: Blob; filename: string } | null>(null);
  const [exportTime, setExportTime] = useState<number | null>(null);
  const [exportScope, setExportScope] = useState<ExportScope>('all');
  const exportStartTimeRef = useRef<number | null>(null);

  const [step, setStep] = useState<Steps>('processing');
  const totalItemsRef = useRef<number>(0);
  const [currentItem, setCurrentItem] = useState('');
  const [processedItems, setProcessedItems] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // For accumulating image batches
  const pendingDocumentRef = useRef<Parameters<typeof parse>[0] | null>(null);
  const accumulatedImagesRef = useRef<Record<string, Uint8Array<ArrayBuffer>>>({});
  const expectedBatchesRef = useRef<number>(0);
  const receivedBatchesRef = useRef<number>(0);

  const postMessage = (type: string, data?: unknown): void => {
    parent.postMessage({ pluginMessage: { type, data } }, '*');
  };

  const calculatePercentage = (item: number, total: number): number => {
    return Math.round((item / total) * 100);
  };

  const processDocument = async (document: Parameters<typeof parse>[0]): Promise<void> => {
    const context = await parse(document);

    sendMessage({
      type: 'PROGRESS_STEP',
      data: {
        step: 'exporting',
        total: Infinity
      }
    });

    const { writable, getBlob } = createInMemoryWritable();

    await exportStream(context, writable, {
      onProgress: ({ item, total }) => {
        sendMessage({
          type: 'PROGRESS_EXPORT',
          data: {
            current: item,
            total: total
          }
        });
      }
    });

    const blob = getBlob();
    const filename = `${document.name}.penpot`;

    setExportedBlob({ blob, filename });

    let duration: number | undefined = undefined;

    if (exportStartTimeRef.current) {
      const endTime = Date.now();
      duration = endTime - exportStartTimeRef.current;

      setExportTime(duration);
    }

    track('File Exported', {
      'Exported File Size': fileSizeInMB(blob.size),
      'Export Time': duration ? formatExportTime(duration) : undefined
    });

    setExporting(false);
    setSummary(true);
    setStep('processing');
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
      case 'RELOAD': {
        setMissingFonts(undefined);
        setExporting(false);
        setSummary(false);
        setError(false);
        setExportedBlob(null);
        setExportTime(null);
        setExportScope('all');
        setStep('processing');
        setCurrentItem('');

        totalItemsRef.current = 0;
        exportStartTimeRef.current = null;

        track('Plugin Reloaded');

        break;
      }
      case 'PENPOT_DOCUMENT': {
        if (pluginMessage.data.missingFonts) {
          setMissingFonts(pluginMessage.data.missingFonts);
        }

        const pendingBatches = pluginMessage.data.pendingImageBatches ?? 0;

        // Store document and reset batch tracking
        pendingDocumentRef.current = pluginMessage.data;
        accumulatedImagesRef.current = {};
        expectedBatchesRef.current = pendingBatches;
        receivedBatchesRef.current = 0;

        // If no batches to wait for, process immediately
        if (pendingBatches === 0) {
          await processDocument(pluginMessage.data);
        }
        // Otherwise wait for image batches

        break;
      }
      case 'IMAGE_BATCH': {
        const { images } = pluginMessage.data;

        // Accumulate images
        Object.assign(accumulatedImagesRef.current, images);
        receivedBatchesRef.current++;

        // When all batches received, process document
        if (receivedBatchesRef.current === expectedBatchesRef.current && pendingDocumentRef.current) {
          const documentWithImages = {
            ...pendingDocumentRef.current,
            images: accumulatedImagesRef.current
          };

          await processDocument(documentWithImages);

          // Clean up refs
          pendingDocumentRef.current = null;
          accumulatedImagesRef.current = {};
          expectedBatchesRef.current = 0;
          receivedBatchesRef.current = 0;
        }

        break;
      }
      case 'PROGRESS_STEP': {
        setStep(pluginMessage.data.step);
        setProgressPercentage(0);
        setProcessedItems(0);

        totalItemsRef.current = pluginMessage.data.total;

        break;
      }
      case 'PROGRESS_CURRENT_ITEM': {
        setCurrentItem(pluginMessage.data);

        break;
      }
      case 'PROGRESS_PROCESSED_ITEMS': {
        setProcessedItems(pluginMessage.data);
        setProgressPercentage(calculatePercentage(pluginMessage.data, totalItemsRef.current));

        break;
      }
      case 'PROGRESS_EXPORT': {
        setProgressPercentage(
          calculatePercentage(pluginMessage.data.current, pluginMessage.data.total)
        );

        break;
      }
      case 'ERROR': {
        setError(true);
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

    window.URL.revokeObjectURL(url);

    track('File Downloaded');
  };

  const downloadBlob = (): void => {
    if (exportedBlob) {
      download(exportedBlob.blob, exportedBlob.filename);
    }
  };

  const retry = (): void => {
    track('Plugin Retry');

    postMessage('retry');
  };

  const cancel = (): void => {
    track('Plugin Closed');

    postMessage('cancel');
  };

  const exportPenpot = (): void => {
    setExporting(true);
    exportStartTimeRef.current = Date.now();

    track('File Export Started', { scope: exportScope });

    postMessage('export', { scope: exportScope });
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
    exporting,
    summary,
    error,
    step,
    progress: {
      currentItem,
      totalItems: totalItemsRef.current,
      processedItems
    },
    progressPercentage,
    exportedBlob,
    exportTime,
    exportScope,
    setExportScope,
    retry,
    cancel,
    exportPenpot,
    downloadBlob
  };
};
