class OverridesLibrary {
  private overrides: Map<string, NodeChangeProperty[]> = new Map();

  public register(nodeId: string, overrides: NodeChangeProperty[]): void {
    this.overrides.set(nodeId, [...(this.overrides.get(nodeId) ?? []), ...overrides]);
  }

  public get(nodeId: string): NodeChangeProperty[] | undefined {
    return this.overrides.get(nodeId);
  }
}

export const overridesLibrary = new OverridesLibrary();
