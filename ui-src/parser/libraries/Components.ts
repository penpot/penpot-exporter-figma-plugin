import { ComponentShape } from '@ui/lib/types/shapes/componentShape';

class Components {
  private components: ComponentShape[] = [];

  public add(component: ComponentShape) {
    this.components.push(component);
  }

  public get() {
    return this.components;
  }

  public clear() {
    this.components = [];
  }
}

export const components = new Components();
