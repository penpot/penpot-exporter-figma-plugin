type TimerHandle = ReturnType<typeof setTimeout>;

export interface MessageBufferConfig<TMessage extends { type: string }> {
  /**
   * Set of message types that should be buffered (only the latest message of each type is kept)
   */
  bufferedTypes: Set<TMessage['type']>;
  /**
   * Interval in milliseconds for flushing buffered messages
   */
  flushInterval: number;
  /**
   * Function to send a message immediately
   */
  sendMessage: (message: TMessage) => void;
  /**
   * Function to create a timeout (defaults to setTimeout)
   */
  setTimeout?: (callback: () => void, ms: number) => TimerHandle;
  /**
   * Function to clear a timeout (defaults to clearTimeout)
   */
  clearTimeout?: (handle: TimerHandle) => void;
}

export interface MessageBuffer<TMessage extends { type: string }> {
  /**
   * Send a message, buffering it if it's a buffered type, otherwise sending immediately
   */
  send: (message: TMessage) => void;
  /**
   * Flush all buffered messages immediately
   */
  flush: () => void;
}

export const createMessageBuffer = <TMessage extends { type: string }>(
  config: MessageBufferConfig<TMessage>
): MessageBuffer<TMessage> => {
  const {
    bufferedTypes,
    flushInterval,
    sendMessage,
    setTimeout: setTimeoutFn = setTimeout,
    clearTimeout: clearTimeoutFn = clearTimeout
  } = config;

  const messageBuffer = new Map<TMessage['type'], TMessage>();
  let flushHandle: TimerHandle | undefined;

  const scheduleFlush = (): void => {
    if (flushHandle !== undefined) {
      return;
    }

    flushHandle = setTimeoutFn(() => {
      flushHandle = undefined;
      flush();
    }, flushInterval);
  };

  const flush = (): void => {
    if (flushHandle !== undefined) {
      clearTimeoutFn(flushHandle);
      flushHandle = undefined;
    }

    if (messageBuffer.size === 0) {
      return;
    }

    for (const message of messageBuffer.values()) {
      sendMessage(message);
    }

    messageBuffer.clear();
  };

  const send = (message: TMessage): void => {
    if (bufferedTypes.has(message.type)) {
      messageBuffer.set(message.type, message);
      scheduleFlush();
      return;
    }

    flush();
    sendMessage(message);
  };

  return { send, flush };
};
