import { ComponentShape } from '@ui/lib/types/shapes/componentShape';

class ComponentLibrary {
  private components: Record<string, ComponentShape> = {};

  public register(id: string, component: ComponentShape) {
    this.components[id] = component;
  }

  public get(id: string): ComponentShape | undefined {
    return this.components[id];
  }

  public all(): Record<string, ComponentShape> {
    return this.components;
  }

  public init(components: Record<string, ComponentShape>): void {
    this.components = components;
  }
}

export const componentsLibrary = new ComponentLibrary();
