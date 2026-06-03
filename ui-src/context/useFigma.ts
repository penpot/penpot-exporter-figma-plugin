import { exportStream } from '@penpot/library';
import * as Sentry from '@sentry/react';
import { useEffect, useRef, useState } from 'preact/hooks';

import { type MessageData, createInMemoryWritable, sendMessage } from '@ui/context';
import { identify, track } from '@ui/metrics/mixpanel';
import { parse } from '@ui/parser';
import type { ErrorOrigin, ErrorPayload, ExportScope, ExternalLibrary, Steps } from '@ui/types';
import { extractFileIdFromPenpotUrl, fileSizeInMB, formatExportTime } from '@ui/utils';

const buildUiErrorPayload = (reason: unknown, origin: ErrorOrigin): ErrorPayload => ({
  message: reason instanceof Error ? reason.message : String(reason),
  stack: reason instanceof Error ? reason.stack : undefined,
  origin
});

export type FormValues = {
  externalLibraries: ExternalLibrary[];
};

export type UseFigmaHook = {
  missingFonts: string[] | undefined;
  exporting: boolean;
  summary: boolean;
  error: ErrorPayload | null;
  step: Steps;
  stepLabel: string | undefined;
  stepName: string | undefined;
  editorType: 'figma' | 'slides' | 'figjam' | 'dev' | 'buzz';
  progress: {
    currentItem: string;
    totalItems: number;
    processedItems: number;
  };
  progressPercentage: number;
  exportedBlob: { blob: Blob; filename: string } | null;
  exportTime: number | null;
  exportScope: ExportScope;
  exportLibraries: string[];
  setExportScope: (scope: ExportScope) => void;
  retry: () => void;
  cancel: () => void;
  exportPenpot: (data: FormValues) => void;
  downloadBlob: () => void;
};

export const useFigma = (): UseFigmaHook => {
  const [missingFonts, setMissingFonts] = useState<string[]>();
  const [exporting, setExporting] = useState(false);
  const [summary, setSummary] = useState(false);
  const [error, setError] = useState<ErrorPayload | null>(null);
  const [exportedBlob, setExportedBlob] = useState<{ blob: Blob; filename: string } | null>(null);
  const [exportTime, setExportTime] = useState<number | null>(null);
  const [exportScope, setExportScope] = useState<ExportScope>('all');
  const [exportLibraries, setExportLibraries] = useState<string[]>([]);
  const [editorType, setEditorType] = useState<UseFigmaHook['editorType']>('figma');
  const exportStartTimeRef = useRef<number | null>(null);

  const [step, setStep] = useState<Steps>('processing');
  const [stepLabel, setStepLabel] = useState<string | undefined>(undefined);
  const [stepName, setStepName] = useState<string | undefined>(undefined);
  const totalItemsRef = useRef<number>(0);
  const [currentItem, setCurrentItem] = useState('');
  const [processedItems, setProcessedItems] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const editorTypeRef = useRef(editorType);
  editorTypeRef.current = editorType;

  const postMessage = (type: string, data?: unknown): void => {
    parent.postMessage({ pluginMessage: { type, data } }, '*');
  };

  const handleError = (payload: ErrorPayload): void => {
    setError(payload);
    setExporting(false);
    track('Error', {
      'Error Message': payload.message,
      'Error Origin': payload.origin,
      'Error Step': payload.step,
      'Error Layer': payload.layer
    });

    if (payload.origin === 'plugin') {
      const sentryError = new Error(payload.message);
      if (payload.stack) sentryError.stack = payload.stack;
      Sentry.captureException(sentryError, {
        tags: {
          errorOrigin: payload.origin,
          errorStep: payload.step ?? 'unknown'
        },
        extra: {
          layer: payload.layer,
          editorType: editorTypeRef.current
        }
      });
    }
  };

  const calculatePercentage = (item: number, total: number): number => {
    return Math.round((item / total) * 100);
  };

  const onMessage = async (event: MessageEvent<MessageData>): Promise<void> => {
    if (!event.data.pluginMessage) return;

    const { pluginMessage } = event.data;

    switch (pluginMessage.type) {
      case 'EXTERNAL_LIBRARIES': {
        setExportLibraries(pluginMessage.data);
        break;
      }
      case 'EDITOR_TYPE': {
        setEditorType(pluginMessage.data);
        if (pluginMessage.data === 'slides' || pluginMessage.data === 'figjam') {
          setExportScope('all');
        }
        break;
      }
      case 'USER_DATA': {
        identify({ userId: pluginMessage.data.userId });
        track('Plugin Loaded');

        break;
      }
      case 'RELOAD': {
        setMissingFonts(undefined);
        setExporting(false);
        setSummary(false);
        setError(null);
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

        const context = await parse(pluginMessage.data);

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
        const filename = `${pluginMessage.data.name}.penpot`;

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

        break;
      }
      case 'PROGRESS_STEP': {
        setStep(pluginMessage.data.step);
        setStepLabel(pluginMessage.data.label);
        setStepName(pluginMessage.data.name);
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
        handleError(pluginMessage.data);

        break;
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

  const exportPenpot = (data: FormValues): void => {
    setExporting(true);
    exportStartTimeRef.current = Date.now();

    track('File Export Started', { scope: exportScope });

    const libraries = data.externalLibraries
      .map(lib => ({
        name: lib.name,
        uuid: extractFileIdFromPenpotUrl(lib.uuid)
      }))
      .filter((lib): lib is ExternalLibrary => lib.uuid !== undefined);

    postMessage('export', { scope: exportScope, libraries });
  };

  useEffect(() => {
    const onWindowError = (event: ErrorEvent): void => {
      handleError(buildUiErrorPayload(event.error ?? event.message, 'ui'));
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent): void => {
      handleError(buildUiErrorPayload(event.reason, 'unhandled-rejection'));
    };

    window.addEventListener('message', onMessage);
    window.addEventListener('error', onWindowError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    postMessage('ready');

    return (): void => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('error', onWindowError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  return {
    missingFonts,
    exporting,
    summary,
    error,
    step,
    stepLabel,
    stepName,
    editorType,
    progress: {
      currentItem,
      totalItems: totalItemsRef.current,
      processedItems
    },
    progressPercentage,
    exportedBlob,
    exportTime,
    exportScope,
    exportLibraries,
    setExportScope,
    retry,
    cancel,
    exportPenpot,
    downloadBlob
  };
};
