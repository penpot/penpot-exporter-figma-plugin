import { Uuid } from '@ui/lib/types/utils/uuid';

export type UiComponent = {
  componentId: Uuid;
  mainInstancePage?: Uuid;
  mainInstanceId: Uuid;
  componentFigmaId: string;
};

class Components {
  private components: Map<string, UiComponent> = new Map();

  public register(id: string, component: UiComponent) {
    this.components.set(id, component);
  }

  public get(id: string): UiComponent | undefined {
    return this.components.get(id);
  }

  public all(): UiComponent[] {
    return Array.from(this.components.values());
  }

  public init() {
    this.components.clear();
  }
}

export const components = new Components();
