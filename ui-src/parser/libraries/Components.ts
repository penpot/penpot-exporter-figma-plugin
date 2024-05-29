import { ComponentShape } from '@ui/lib/types/shapes/componentShape';

class Components {
  private components: ComponentShape[] = [];

  public addComponent(component: ComponentShape) {
    this.components.push(component);
  }

  public getComponents() {
    return this.components;
  }

  public clearComponents() {
    this.components = [];
  }
}

export const components = new Components();
