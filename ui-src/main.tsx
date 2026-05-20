import '@create-figma-plugin/ui/css/base.css';
import * as Sentry from '@sentry/react';
import type { JSX } from 'preact';
import { StrictMode } from 'preact/compat';
import { createRoot } from 'react-dom/client';

import { App } from '@ui/App';
import { FatalErrorFallback } from '@ui/components/FatalErrorFallback';
import { initializeMixpanel } from '@ui/metrics/mixpanel';
import { initializeSentry } from '@ui/metrics/sentry';

import './main.css';
import './reset.css';

initializeMixpanel();
initializeSentry();

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={({ error }): JSX.Element => (
        <FatalErrorFallback error={error instanceof Error ? error : new Error(String(error))} />
      )}
    >
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);
