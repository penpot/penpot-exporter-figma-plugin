import { ComponentShape } from '@ui/lib/types/shapes/componentShape';

class Components {
  private components: Map<string, ComponentShape> = new Map();

  public register(id: string, component: ComponentShape) {
    this.components.set(id, component);
  }

  public get(id: string): ComponentShape | undefined {
    return this.components.get(id);
  }

  public all(): Record<string, ComponentShape> {
    return Object.fromEntries(this.components.entries());
  }

  public init(components: Record<string, ComponentShape>): void {
    this.components = new Map(Object.entries(components));
  }
}

export const components = new Components();
