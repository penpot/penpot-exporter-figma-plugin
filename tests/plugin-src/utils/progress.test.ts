import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { degradedLayers } from '@plugin/libraries';

import type { PenpotDocument, PluginMessage } from '@ui/types';

// Mock figma API
const mockPostMessage = vi.fn();

describe('progress', () => {
  let flushProgress: () => void;
  let reportProgress: (message: PluginMessage) => void;
  let resetProgress: () => void;
  let setImagePlatformFailureHandler: (handler: (key: string) => void) => void;
  let resetFigmaPlatformCorruption: () => void;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.resetModules();
    mockPostMessage.mockClear();

    // Mock figma antes de importar el módulo
    (globalThis as { figma?: typeof figma }).figma = {
      ui: {
        postMessage: mockPostMessage
      }
    } as unknown as typeof figma;

    // Importar el módulo después de resetear
    // @ts-expect-error - Dynamic import es soportado por Vitest/esbuild en runtime
    const progressModule = await import('@plugin/utils/progress');
    const figmaPlatformErrorModule = await import('@plugin/utils/figmaPlatformError');
    flushProgress = progressModule.flushProgress;
    reportProgress = progressModule.reportProgress;
    resetProgress = progressModule.resetProgress;
    setImagePlatformFailureHandler = progressModule.setImagePlatformFailureHandler;
    resetFigmaPlatformCorruption = figmaPlatformErrorModule.resetFigmaPlatformCorruption;
    resetProgress();
    degradedLayers.clear();
    resetFigmaPlatformCorruption();
    setImagePlatformFailureHandler(key => {
      degradedLayers.set(`image:${key}`, `Image "${key}": skipped due to a Figma platform error`);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    degradedLayers.clear();
    resetFigmaPlatformCorruption();
  });

  describe('reportProgress', () => {
    it('envía mensaje no bufferizado inmediatamente', () => {
      const message = {
        type: 'PROGRESS_STEP',
        data: { step: 'processing', total: 5 }
      } as const;
      reportProgress(message);
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith(message);
    });

    it('bufferiza mensaje PROGRESS_CURRENT_ITEM', () => {
      const message = {
        type: 'PROGRESS_CURRENT_ITEM',
        data: 'Item 1'
      } as const;
      reportProgress(message);
      // No debería enviarse inmediatamente
      expect(mockPostMessage).not.toHaveBeenCalled();
      // Avanzar el tiempo para que se flush
      vi.advanceTimersByTime(500);
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith(message);
    });

    it('no envía PROGRESS_CURRENT_ITEM duplicado', () => {
      const message = {
        type: 'PROGRESS_CURRENT_ITEM',
        data: 'Item 1'
      } as const;
      reportProgress(message);
      vi.advanceTimersByTime(500);
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      // Enviar el mismo mensaje de nuevo
      reportProgress(message);
      vi.advanceTimersByTime(500);
      // No debería enviarse porque es el mismo
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
    });

    it('envía PROGRESS_CURRENT_ITEM diferente', () => {
      reportProgress({ type: 'PROGRESS_CURRENT_ITEM', data: 'Item 1' });
      vi.advanceTimersByTime(500);
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      reportProgress({ type: 'PROGRESS_CURRENT_ITEM', data: 'Item 2' });
      vi.advanceTimersByTime(500);
      expect(mockPostMessage).toHaveBeenCalledTimes(2);
    });

    it('bufferiza mensaje PROGRESS_PROCESSED_ITEMS', () => {
      const message = {
        type: 'PROGRESS_PROCESSED_ITEMS',
        data: 10
      } as const;
      reportProgress(message);
      expect(mockPostMessage).not.toHaveBeenCalled();
      vi.advanceTimersByTime(500);
      expect(mockPostMessage).toHaveBeenCalledWith(message);
    });

    it('bufferiza mensaje PROGRESS_EXPORT', () => {
      const message = {
        type: 'PROGRESS_EXPORT',
        data: { current: 5, total: 10 }
      } as const;
      reportProgress(message);
      expect(mockPostMessage).not.toHaveBeenCalled();
      vi.advanceTimersByTime(500);
      expect(mockPostMessage).toHaveBeenCalledWith(message);
    });

    it('mantiene solo el último mensaje bufferizado del mismo tipo', () => {
      reportProgress({ type: 'PROGRESS_PROCESSED_ITEMS', data: 5 });
      reportProgress({ type: 'PROGRESS_PROCESSED_ITEMS', data: 10 });
      reportProgress({ type: 'PROGRESS_PROCESSED_ITEMS', data: 15 });
      vi.advanceTimersByTime(500);
      // Solo debería enviarse el último
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'PROGRESS_PROCESSED_ITEMS',
        data: 15
      });
    });
  });

  describe('flushProgress', () => {
    it('fuerza el envío de mensajes bufferizados', () => {
      reportProgress({ type: 'PROGRESS_CURRENT_ITEM', data: 'Item 1' });
      expect(mockPostMessage).not.toHaveBeenCalled();
      flushProgress();
      // flushProgress también llama a flush() que puede enviar mensajes pendientes
      expect(mockPostMessage).toHaveBeenCalled();
      expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'PROGRESS_CURRENT_ITEM',
        data: 'Item 1'
      });
    });

    it('no hace nada si no hay mensajes bufferizados', () => {
      flushProgress();
      expect(mockPostMessage).not.toHaveBeenCalled();
    });

    it('flush múltiples mensajes bufferizados de diferentes tipos', () => {
      reportProgress({ type: 'PROGRESS_CURRENT_ITEM', data: 'Item 1' });
      reportProgress({ type: 'PROGRESS_PROCESSED_ITEMS', data: 10 });
      reportProgress({ type: 'PROGRESS_EXPORT', data: { current: 5, total: 10 } });
      flushProgress();
      expect(mockPostMessage).toHaveBeenCalledTimes(3);
    });
  });

  describe('resetProgress', () => {
    it('resetea el estado de lastSentCurrentItem', () => {
      reportProgress({ type: 'PROGRESS_CURRENT_ITEM', data: 'Item 1' });
      vi.advanceTimersByTime(500);
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      // Ahora el mismo mensaje no se enviaría
      reportProgress({ type: 'PROGRESS_CURRENT_ITEM', data: 'Item 1' });
      vi.advanceTimersByTime(500);
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      // Después de reset, debería enviarse de nuevo
      resetProgress();
      reportProgress({ type: 'PROGRESS_CURRENT_ITEM', data: 'Item 1' });
      vi.advanceTimersByTime(500);
      expect(mockPostMessage).toHaveBeenCalledTimes(2);
    });
  });

  describe('postMessage failures', () => {
    it('propagates a Figma platform error when sending PENPOT_DOCUMENT', () => {
      mockPostMessage.mockImplementationOnce(() => {
        throw new Error('in <unknown>: Attempted to invoke callback with invalid id -32408');
      });

      expect(() => {
        reportProgress({
          type: 'PENPOT_DOCUMENT',
          data: {} as PenpotDocument
        });
      }).toThrow('Attempted to invoke callback with invalid id');
    });

    it('contains a Figma platform error when sending PENPOT_IMAGE', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      mockPostMessage.mockImplementationOnce(() => {
        throw new Error('in <unknown>: Attempted to invoke callback with invalid id -32408');
      });

      expect(() => {
        reportProgress({
          type: 'PENPOT_IMAGE',
          data: { key: 'image-key', bytes: new Uint8Array([1]) }
        });
      }).not.toThrow();
      expect(degradedLayers.get('image:image-key')).toBe(
        'Image "image-key": skipped due to a Figma platform error'
      );

      consoleWarnSpy.mockRestore();
    });

    it('propagates non-platform postMessage errors before corruption is detected', () => {
      mockPostMessage.mockImplementationOnce(() => {
        throw new Error('boom');
      });

      expect(() => {
        reportProgress({
          type: 'PENPOT_IMAGE',
          data: { key: 'image-key', bytes: new Uint8Array([1]) }
        });
      }).toThrow('boom');
      expect(degradedLayers).toHaveLength(0);
    });
  });
});
