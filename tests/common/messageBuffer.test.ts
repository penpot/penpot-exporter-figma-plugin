import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type MessageBufferConfig, createMessageBuffer } from '@common/messageBuffer';

type TestMessage = { type: string; data?: unknown };

describe('createMessageBuffer', () => {
  let mockSendMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockSendMessage = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createConfig = <T extends { type: string }>(
    overrides?: Partial<MessageBufferConfig<T>>
  ): MessageBufferConfig<T> => ({
    bufferedTypes: new Set(),
    flushInterval: 100,
    sendMessage: mockSendMessage as (message: T) => void,
    ...overrides
  });

  describe('send', () => {
    it('envía mensaje no bufferizado inmediatamente', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['BUFFERED_TYPE'])
        })
      );
      const message: TestMessage = { type: 'IMMEDIATE_TYPE', data: 'test' };
      buffer.send(message);
      expect(mockSendMessage).toHaveBeenCalledTimes(1);
      expect(mockSendMessage).toHaveBeenCalledWith(message);
    });

    it('bufferiza mensaje de tipo bufferizado', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['BUFFERED_TYPE'])
        })
      );
      const message: TestMessage = { type: 'BUFFERED_TYPE', data: 'test' };
      buffer.send(message);
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('mantiene solo el último mensaje bufferizado del mismo tipo', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['BUFFERED_TYPE'])
        })
      );
      buffer.send({ type: 'BUFFERED_TYPE', data: 'first' } as TestMessage);
      buffer.send({ type: 'BUFFERED_TYPE', data: 'second' } as TestMessage);
      buffer.send({ type: 'BUFFERED_TYPE', data: 'third' } as TestMessage);
      vi.advanceTimersByTime(100);
      expect(mockSendMessage).toHaveBeenCalledTimes(1);
      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'BUFFERED_TYPE',
        data: 'third'
      });
    });

    it('mantiene mensajes bufferizados de diferentes tipos', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['TYPE_A', 'TYPE_B'])
        })
      );
      buffer.send({ type: 'TYPE_A', data: 'a' } as TestMessage);
      buffer.send({ type: 'TYPE_B', data: 'b' } as TestMessage);
      vi.advanceTimersByTime(100);
      expect(mockSendMessage).toHaveBeenCalledTimes(2);
      expect(mockSendMessage).toHaveBeenCalledWith({ type: 'TYPE_A', data: 'a' });
      expect(mockSendMessage).toHaveBeenCalledWith({ type: 'TYPE_B', data: 'b' });
    });

    it('programa flush después de bufferizar', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['BUFFERED_TYPE']),
          flushInterval: 200
        })
      );
      buffer.send({ type: 'BUFFERED_TYPE', data: 'test' } as TestMessage);
      expect(vi.getTimerCount()).toBe(1);
      vi.advanceTimersByTime(200);
      expect(mockSendMessage).toHaveBeenCalledTimes(1);
    });

    it('no programa múltiples flushes si ya hay uno programado', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['BUFFERED_TYPE'])
        })
      );
      buffer.send({ type: 'BUFFERED_TYPE', data: 'first' } as TestMessage);
      const timerCount1 = vi.getTimerCount();
      buffer.send({ type: 'BUFFERED_TYPE', data: 'second' } as TestMessage);
      const timerCount2 = vi.getTimerCount();
      // El número de timers no debería aumentar
      expect(timerCount2).toBe(timerCount1);
    });

    it('hace flush de mensajes pendientes antes de enviar no bufferizado', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['BUFFERED_TYPE'])
        })
      );
      buffer.send({ type: 'BUFFERED_TYPE', data: 'buffered' } as TestMessage);
      buffer.send({ type: 'IMMEDIATE_TYPE', data: 'immediate' } as TestMessage);
      // Debería hacer flush del bufferizado primero, luego enviar el inmediato
      expect(mockSendMessage).toHaveBeenCalledTimes(2);
      expect(mockSendMessage).toHaveBeenNthCalledWith(1, {
        type: 'BUFFERED_TYPE',
        data: 'buffered'
      });
      expect(mockSendMessage).toHaveBeenNthCalledWith(2, {
        type: 'IMMEDIATE_TYPE',
        data: 'immediate'
      });
    });
  });

  describe('flush', () => {
    it('envía todos los mensajes bufferizados', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['TYPE_A', 'TYPE_B', 'TYPE_C'])
        })
      );
      buffer.send({ type: 'TYPE_A', data: 'a' } as TestMessage);
      buffer.send({ type: 'TYPE_B', data: 'b' } as TestMessage);
      buffer.send({ type: 'TYPE_C', data: 'c' } as TestMessage);
      buffer.flush();
      expect(mockSendMessage).toHaveBeenCalledTimes(3);
    });

    it('limpia el buffer después de flush', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['BUFFERED_TYPE'])
        })
      );
      buffer.send({ type: 'BUFFERED_TYPE', data: 'test' } as TestMessage);
      buffer.flush();
      mockSendMessage.mockClear();
      vi.advanceTimersByTime(100);
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('cancela el timer programado al hacer flush', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['BUFFERED_TYPE'])
        })
      );
      buffer.send({ type: 'BUFFERED_TYPE', data: 'test' } as TestMessage);
      expect(vi.getTimerCount()).toBe(1);
      buffer.flush();
      // El timer debería ser cancelado
      expect(vi.getTimerCount()).toBe(0);
      // Avanzar el tiempo no debería enviar nada más
      vi.advanceTimersByTime(100);
      expect(mockSendMessage).toHaveBeenCalledTimes(1);
    });

    it('no hace nada si el buffer está vacío', () => {
      const buffer = createMessageBuffer(createConfig());
      buffer.flush();
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('envía mensajes en el orden correcto', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['TYPE_A', 'TYPE_B'])
        })
      );
      buffer.send({ type: 'TYPE_A', data: 'a' } as TestMessage);
      buffer.send({ type: 'TYPE_B', data: 'b' } as TestMessage);
      buffer.flush();
      expect(mockSendMessage).toHaveBeenNthCalledWith(1, {
        type: 'TYPE_A',
        data: 'a'
      });
      expect(mockSendMessage).toHaveBeenNthCalledWith(2, {
        type: 'TYPE_B',
        data: 'b'
      });
    });
  });

  describe('auto-flush', () => {
    it('hace flush automático después del intervalo', () => {
      const buffer = createMessageBuffer(
        createConfig({
          bufferedTypes: new Set(['BUFFERED_TYPE']),
          flushInterval: 150
        })
      );
      buffer.send({ type: 'BUFFERED_TYPE', data: 'test' } as TestMessage);
      expect(mockSendMessage).not.toHaveBeenCalled();
      vi.advanceTimersByTime(150);
      expect(mockSendMessage).toHaveBeenCalledTimes(1);
      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'BUFFERED_TYPE',
        data: 'test'
      });
    });

    it('usa setTimeout y clearTimeout por defecto si no se proporcionan', () => {
      const buffer = createMessageBuffer({
        bufferedTypes: new Set(['BUFFERED_TYPE']),
        flushInterval: 100,
        sendMessage: mockSendMessage as (message: TestMessage) => void
      });
      buffer.send({ type: 'BUFFERED_TYPE', data: 'test' } as TestMessage);
      expect(vi.getTimerCount()).toBe(1);
      vi.advanceTimersByTime(100);
      expect(mockSendMessage).toHaveBeenCalledTimes(1);
      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'BUFFERED_TYPE',
        data: 'test'
      });
    });
  });
});
