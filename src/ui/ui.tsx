import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { PenpotExporter } from './PenpotExporter';
import './ui.css';

createRoot(document.getElementById('penpot-export-page') as HTMLElement).render(
  <StrictMode>
    <PenpotExporter />
  </StrictMode>
);
