import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';
import 'node_modules/@create-figma-plugin/ui/lib/css/base.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './main.css';
import './reset.css';

const options = {
  init: {
    distributed_tracing: { enabled: false },
    privacy: { cookies_enabled: true },
    ajax: { deny_list: ['bam.eu01.nr-data.net'] }
  },
  loader_config: {
    accountID: import.meta.env.VITE_ACCOUNT_ID,
    trustKey: import.meta.env.VITE_TRUST_KEY,
    agentID: import.meta.env.VITE_AGENT_ID,
    licenseKey: import.meta.env.VITE_LICENSE_KEY,
    applicationID: import.meta.env.VITE_APPLICATION_ID
  },
  info: {
    beacon: 'bam.eu01.nr-data.net',
    errorBeacon: 'bam.eu01.nr-data.net',
    licenseKey: import.meta.env.VITE_LICENSE_KEY,
    applicationID: import.meta.env.VITE_APPLICATION_ID,
    sa: 1
  }
};

new BrowserAgent(options);

declare global {
  interface Window {
    newrelic: BrowserAgent;
  }
}

window.newrelic.addPageAction('plugin-loaded');

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
