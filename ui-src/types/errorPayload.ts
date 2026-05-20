import type { Steps } from './progressMessages';

export type ErrorOrigin = 'plugin' | 'ui' | 'unhandled-rejection';

export type ErrorPayload = {
  message: string;
  stack?: string;
  step?: Steps;
  layer?: string;
  origin: ErrorOrigin;
};
