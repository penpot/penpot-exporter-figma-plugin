import { exportStream } from '@penpot/library';
import { useEffect, useRef, useState } from 'preact/hooks';

import { type MessageData, createInMemoryWritable, sendMessage } from '@ui/context';
import { identify, track } from '@ui/metrics/mixpanel';
import { parse } from '@ui/parser';
import type { ExportScope, ExternalLibrary, Steps } from '@ui/types';
import { extractFileIdFromPenpotUrl, fileSizeInMB, formatExportTime } from '@ui/utils';

export type FormValues = {
  externalLibraries: ExternalLibrary[];
};

export type ExternalVariableInfo = {
  variableId: string;
  variableName: string;
  collectionId: string;
  collectionName: string;
  libraryName: string | null;
  usedIn: string[];
};

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
  exportLibraries: string[];
  externalVariablesWarning: ExternalVariableInfo[] | null;
  libraryNames: string[];
  setExportScope: (scope: ExportScope) => void;
  retry: () => void;
  cancel: () => void;
  exportPenpot: (data: FormValues) => void;
  exportWithExternalVariables: (includeExternalVariables: boolean) => void;
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
  const [exportLibraries, setExportLibraries] = useState<string[]>([]);
  const [externalVariablesWarning, setExternalVariablesWarning] = useState<
    ExternalVariableInfo[] | null
  >(null);
  const [libraryNames, setLibraryNames] = useState<string[]>([]);
  const exportStartTimeRef = useRef<number | null>(null);
  const pendingExportDataRef = useRef<FormValues | null>(null);

  const [step, setStep] = useState<Steps>('processing');
  const totalItemsRef = useRef<number>(0);
  const [currentItem, setCurrentItem] = useState('');
  const [processedItems, setProcessedItems] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const postMessage = (type: string, data?: unknown): void => {
    parent.postMessage({ pluginMessage: { type, data } }, '*');
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
      case 'EXTERNAL_VARIABLES_DETECTED': {
        setExternalVariablesWarning(pluginMessage.data.variables);
        setLibraryNames(pluginMessage.data.libraryNames);
        setExporting(false);
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
        setError(false);
        setExportedBlob(null);
        setExportTime(null);
        setExportScope('all');
        setStep('processing');
        setCurrentItem('');
        setExternalVariablesWarning(null);
        setLibraryNames([]);

        totalItemsRef.current = 0;
        exportStartTimeRef.current = null;
        pendingExportDataRef.current = null;

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

  const exportPenpot = (data: FormValues): void => {
    setExporting(true);
    exportStartTimeRef.current = Date.now();
    pendingExportDataRef.current = data;

    track('File Export Started', { scope: exportScope });

    const libraries = data.externalLibraries
      .map(lib => ({
        name: lib.name,
        uuid: extractFileIdFromPenpotUrl(lib.uuid)
      }))
      .filter((lib): lib is ExternalLibrary => lib.uuid !== undefined);

    postMessage('export', { scope: exportScope, libraries, includeExternalVariables: false });
  };

  const exportWithExternalVariables = (includeExternalVariables: boolean): void => {
    if (!pendingExportDataRef.current) return;

    setExternalVariablesWarning(null);
    setLibraryNames([]);
    setExporting(true);
    exportStartTimeRef.current = Date.now();

    track('File Export Started', { scope: exportScope, includeExternalVariables });

    const libraries = pendingExportDataRef.current.externalLibraries
      .map(lib => ({
        name: lib.name,
        uuid: extractFileIdFromPenpotUrl(lib.uuid)
      }))
      .filter((lib): lib is ExternalLibrary => lib.uuid !== undefined);

    // Skip detection when user has already made a choice
    postMessage('export', {
      scope: exportScope,
      libraries,
      includeExternalVariables,
      skipDetection: true
    });
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
    exportLibraries,
    externalVariablesWarning,
    libraryNames,
    setExportScope,
    retry,
    cancel,
    exportPenpot,
    exportWithExternalVariables,
    downloadBlob
  };
};
