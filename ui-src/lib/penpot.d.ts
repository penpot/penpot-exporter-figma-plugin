declare module '@penpot/library' {
  import type { PenpotContext } from '@ui/lib/types/penpotContext';
  import type { ExportOptions } from '@ui/lib/types/exportOptions';
  export function createBuildContext(options?: { referer?: string }): PenpotContext;
  export async function exportAsBytes(
    context: PenpotContext,
    options?: ExportOptions
  ): Promise<Uint8Array<ArrayBuffer>>;
}
