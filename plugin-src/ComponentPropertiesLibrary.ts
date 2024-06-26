import { ComponentProperty } from '@ui/types';

export class ComponentPropertiesLibrary {
  private properties: Map<string, ComponentProperty> = new Map();

  public register(id: string, property: ComponentProperty) {
    this.properties.set(id, property);
  }

  public registerAll(properties: Record<string, ComponentProperty>) {
    Object.entries(properties).forEach(([key, value]) => {
      if (value.type === 'TEXT' || value.type === 'BOOLEAN') {
        this.register(key, value);
      }
    });
  }

  public get(id: string): ComponentProperty | undefined {
    return this.properties.get(id);
  }

  public all(): Record<string, ComponentProperty> {
    return Object.fromEntries(this.properties.entries());
  }

  public init(properties: Record<string, ComponentProperty>): void {
    this.properties = new Map(Object.entries(properties));
  }
}
