class RemoteComponentsLibrary {
  private components: Record<string, ComponentNode | ComponentSetNode> = {};
  private keys: string[] = [];

  public register(id: string, component: ComponentNode | ComponentSetNode) {
    if (!Object.prototype.hasOwnProperty.call(this.components, id)) {
      this.keys.push(id);
    }

    this.components[id] = component;
  }

  public get(id: string): ComponentNode | ComponentSetNode | undefined {
    return this.components[id];
  }

  public pop(): ComponentNode | ComponentSetNode {
    const lastKey = this.keys.pop();

    if (!lastKey) throw new Error('No components to pop');

    const value = this.components[lastKey];
    delete this.components[lastKey];

    return value;
  }

  public length(): number {
    return this.keys.length;
  }
}

export const remoteComponentLibrary = new RemoteComponentsLibrary();
