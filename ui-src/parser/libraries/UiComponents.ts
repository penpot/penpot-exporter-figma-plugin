import { Uuid } from '@ui/lib/types/utils/uuid';

type UiComponent = {
  componentId: Uuid;
  mainInstancePage?: Uuid;
  mainInstanceId: Uuid;
  componentFigmaId: string;
};

class UiComponents {
  private components: Record<string, UiComponent> = {};

  public register(id: string, component: UiComponent) {
    this.components[id] = component;
  }

  public get(id: string): UiComponent | undefined {
    return this.components[id];
  }

  public all(): UiComponent[] {
    return Object.values(this.components);
  }

  public init() {
    this.components = {};
  }
}

export const uiComponents = new UiComponents();
