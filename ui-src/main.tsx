import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { PenpotExporter } from './PenpotExporter';
import './main.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <PenpotExporter />
  </StrictMode>
);
