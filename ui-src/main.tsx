import 'node_modules/@create-figma-plugin/ui/lib/css/base.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { initializeMixpanel } from '@ui/metrics/mixpanel';
import { initializeSentry } from '@ui/metrics/sentry';

import { App } from './App';
import './main.css';
import './reset.css';

initializeMixpanel();
initializeSentry();

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
