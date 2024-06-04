import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';

class RemoteComponentLibrary {
  private components: Record<string, ComponentShape | FrameShape> = {};

  public register(id: string, component: ComponentShape | FrameShape) {
    this.components[id] = component;
  }

  public get(id: string): ComponentShape | FrameShape | undefined {
    return this.components[id];
  }

  public all(): Record<string, ComponentShape | FrameShape> {
    return this.components;
  }

  public init(components: Record<string, ComponentShape | FrameShape>): void {
    this.components = components;
  }
}

export const remoteComponentsLibrary = new RemoteComponentLibrary();
