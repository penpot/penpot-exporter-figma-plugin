import { PenpotNode } from '@ui/types';

class RemoteComponentsLibrary {
  private components: PenpotNode[] = [];
  private registry: Record<string, null> = {};

  public add(component: PenpotNode) {
    this.components.push(component);
  }

  public register(id: string) {
    this.registry[id] = null;
  }

  public has(id: string): boolean {
    return this.registry[id] === null;
  }

  public total(): number {
    return this.components.length;
  }

  public all(): PenpotNode[] {
    return this.components;
  }
}

export const remoteComponentLibrary = new RemoteComponentsLibrary();
