class RemoteComponentsLibrary {
  private components: Record<string, ComponentNode | ComponentSetNode> = {};
  private queue: string[] = [];

  public register(id: string, component: ComponentNode | ComponentSetNode) {
    if (!Object.prototype.hasOwnProperty.call(this.components, id)) {
      this.queue.push(id);
    }

    this.components[id] = component;
  }

  public get(id: string): ComponentNode | ComponentSetNode | undefined {
    return this.components[id];
  }

  public next(): ComponentNode | ComponentSetNode {
    const lastKey = this.queue.pop();

    if (!lastKey) throw new Error('No components to pop');

    return this.components[lastKey];
  }

  public remaining(): number {
    return this.queue.length;
  }

  public total(): number {
    return Object.keys(this.components).length;
  }
}

export const remoteComponentLibrary = new RemoteComponentsLibrary();
