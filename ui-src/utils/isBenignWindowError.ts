// Browsers report these through window.onerror, but they are harmless notifications
// (e.g. use-resize-observer skipping a frame) and must not abort an export.
const BENIGN_WINDOW_ERRORS = [
  'ResizeObserver loop completed with undelivered notifications',
  'ResizeObserver loop limit exceeded'
];

export const isBenignWindowError = (message: string | undefined): boolean => {
  if (!message) return false;

  return BENIGN_WINDOW_ERRORS.some(benign => message.includes(benign));
};
