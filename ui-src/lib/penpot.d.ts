declare module '@penpot/library' {
  import { PenpotContext } from '@ui/lib/types/penpotContext';
  export function createBuildContext(): PenpotContext;
  export async function exportAsBytes(context: PenpotContext): Promise<Uint8Array>;
}
