import type { ExportOptions } from '@ui/types';

const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  backgroundBlur: false
};

let exportOptions: ExportOptions = DEFAULT_EXPORT_OPTIONS;

// Set once per export, before the document is built. It is authoritative for
// the whole run, so there is nothing to reset in `clearAllState()`.
export const setExportOptions = (options: ExportOptions): void => {
  exportOptions = options;
};

// Background blur is only painted by Penpot's WebGL renderer, so exporting it
// is opt-in. Expose it as a capability so partials gate on a behaviour.
export const exportsBackgroundBlur = (): boolean => exportOptions.backgroundBlur;
