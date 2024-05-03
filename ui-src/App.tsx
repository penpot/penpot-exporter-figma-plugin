import Logo from '@ui/assets/logo.svg?react';
import { PenpotExporter } from '@ui/components/PenpotExporter';

export const App = () => (
  <main>
    <header>
      <Logo />
      <h2>Penpot Exporter</h2>
    </header>
    <PenpotExporter />
  </main>
);
