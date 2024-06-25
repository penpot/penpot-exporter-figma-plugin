export class RemoteComponentsLibrary {
  private components: Map<string, ComponentNode | ComponentSetNode> = new Map();
  private queue: string[] = [];

  public register(id: string, component: ComponentNode | ComponentSetNode) {
    if (!this.components.has(id)) {
      this.queue.push(id);
    }

    this.components.set(id, component);
  }

  public get(id: string): ComponentNode | ComponentSetNode | undefined {
    return this.components.get(id);
  }

  public has(id: string): boolean {
    return this.components.has(id);
  }

  public next(): ComponentNode | ComponentSetNode {
    const lastKey = this.queue.pop();

    if (!lastKey) throw new Error('No components to pop');

    const component = this.components.get(lastKey);
    if (!component) throw new Error('Component not found');

    return component;
  }

  public remaining(): number {
    return this.queue.length;
  }

  public total(): number {
    return this.components.size;
  }
}
