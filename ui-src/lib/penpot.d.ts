declare module '@penpot/library' {
  import { PenpotContext } from '@ui/lib/types/penpotContext';
  import { ExportOptions } from '@ui/lib/types/exportOptions';
  export function createBuildContext(options?: { referer?: string }): PenpotContext;
  export async function exportAsBytes(
    context: PenpotContext,
    options?: ExportOptions
  ): Promise<Uint8Array>;
}
