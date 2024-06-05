class RemoteComponentsLibrary {
  private components: Record<string, ComponentNode> = {};

  public register(id: string, component: ComponentNode) {
    this.components[id] = component;
  }

  public get(id: string): ComponentNode | undefined {
    return this.components[id];
  }

  public unregister(id: string) {
    delete this.components[id];
  }

  public all(): Record<string, ComponentNode> {
    return this.components;
  }

  public init(components: Record<string, ComponentNode>): void {
    this.components = components;
  }

  public getNodes(): SceneNode[] {
    const components = Object.values(this.components);
    const componentSets: Record<string, ComponentSetNode> = {};
    components.forEach(component => {
      if (component.parent?.type === 'COMPONENT_SET') {
        this.unregister(component.id);
        componentSets[component.parent.id] = component.parent;
      }
    });

    return [...Object.values(componentSets), ...Object.values(this.components)];
  }
}

export const remoteComponentLibrary = new RemoteComponentsLibrary();
