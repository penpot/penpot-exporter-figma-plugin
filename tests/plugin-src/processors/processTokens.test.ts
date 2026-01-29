import { beforeEach, describe, expect, it, vi } from 'vitest';

import { variables } from '@plugin/libraries';
import { resolveAlias, resolveVariableValue } from '@plugin/processors/processTokens';

import type { Token } from '@ui/lib/types/shapes/tokens';

// Mock figma global
const mockFigma = {
  variables: {
    getVariableByIdAsync: vi.fn()
  }
};

// @ts-expect-error - Mocking global figma object for tests
global.figma = mockFigma as typeof figma;

describe('resolveVariableValue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves external color variable to RGB string', async () => {
    const mockVariable = {
      id: 'external-var-1',
      valuesByMode: {
        'mode-1': { r: 1, g: 0.5, b: 0 }
      }
    };

    mockFigma.variables.getVariableByIdAsync.mockResolvedValue(mockVariable);

    const result = await resolveVariableValue('external-var-1', 'color');

    expect(result).toBe('rgb(255, 128, 0)');
    expect(mockFigma.variables.getVariableByIdAsync).toHaveBeenCalledWith('external-var-1');
  });

  it('resolves external color variable with alpha to RGBA string', async () => {
    const mockVariable = {
      id: 'external-var-2',
      valuesByMode: {
        'mode-1': { r: 0, g: 1, b: 0, a: 0.5 }
      }
    };

    mockFigma.variables.getVariableByIdAsync.mockResolvedValue(mockVariable);

    const result = await resolveVariableValue('external-var-2', 'color');

    expect(result).toBe('rgba(0, 255, 0, 0.50)');
  });

  it('resolves nested alias chain (variable -> alias -> color)', async () => {
    const colorVariable = {
      id: 'color-var',
      valuesByMode: {
        'mode-1': { r: 1, g: 0, b: 0 }
      }
    };

    const aliasVariable = {
      id: 'alias-var',
      valuesByMode: {
        'mode-1': { id: 'color-var' }
      }
    };

    mockFigma.variables.getVariableByIdAsync
      .mockResolvedValueOnce(aliasVariable)
      .mockResolvedValueOnce(colorVariable);

    const result = await resolveVariableValue('alias-var', 'color');

    expect(result).toBe('rgb(255, 0, 0)');
    expect(mockFigma.variables.getVariableByIdAsync).toHaveBeenCalledTimes(2);
    expect(mockFigma.variables.getVariableByIdAsync).toHaveBeenNthCalledWith(1, 'alias-var');
    expect(mockFigma.variables.getVariableByIdAsync).toHaveBeenNthCalledWith(2, 'color-var');
  });

  it('resolves number variable', async () => {
    const mockVariable = {
      id: 'number-var',
      valuesByMode: {
        'mode-1': 42
      }
    };

    mockFigma.variables.getVariableByIdAsync.mockResolvedValue(mockVariable);

    const result = await resolveVariableValue('number-var', 'spacing');

    expect(result).toBe('42');
  });

  it('resolves opacity variable (divides by 100)', async () => {
    const mockVariable = {
      id: 'opacity-var',
      valuesByMode: {
        'mode-1': 50
      }
    };

    mockFigma.variables.getVariableByIdAsync.mockResolvedValue(mockVariable);

    const result = await resolveVariableValue('opacity-var', 'opacity');

    expect(result).toBe('0.5');
  });

  it('resolves string variable', async () => {
    const mockVariable = {
      id: 'string-var',
      valuesByMode: {
        'mode-1': 'Arial'
      }
    };

    mockFigma.variables.getVariableByIdAsync.mockResolvedValue(mockVariable);

    const result = await resolveVariableValue('string-var', 'fontWeights');

    expect(result).toBe('Arial');
  });

  it('resolves fontFamilies as array', async () => {
    const mockVariable = {
      id: 'font-var',
      valuesByMode: {
        'mode-1': 'Inter'
      }
    };

    mockFigma.variables.getVariableByIdAsync.mockResolvedValue(mockVariable);

    const result = await resolveVariableValue('font-var', 'fontFamilies');

    expect(result).toEqual(['Inter']);
  });

  it('returns null when variable does not exist', async () => {
    mockFigma.variables.getVariableByIdAsync.mockResolvedValue(null);

    const result = await resolveVariableValue('non-existent', 'color');

    expect(result).toBeNull();
  });

  it('returns null when variable has no modes', async () => {
    const mockVariable = {
      id: 'no-mode-var',
      valuesByMode: {}
    };

    mockFigma.variables.getVariableByIdAsync.mockResolvedValue(mockVariable);

    const result = await resolveVariableValue('no-mode-var', 'color');

    expect(result).toBeNull();
  });

  it('stops at maxDepth to prevent infinite loops', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const aliasVariable = {
      id: 'alias-var',
      valuesByMode: {
        'mode-1': { id: 'alias-var' } // Circular reference
      }
    };

    mockFigma.variables.getVariableByIdAsync.mockResolvedValue(aliasVariable);

    const result = await resolveVariableValue('alias-var', 'color', 2);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Max alias resolution depth reached for variable:',
      'alias-var'
    );

    consoleSpy.mockRestore();
  });
});

describe('resolveAlias', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    variables.clear();
  });

  it('returns token unchanged if value is not an alias', async () => {
    const token: Token = {
      $value: 'rgb(255, 0, 0)',
      $type: 'color',
      $description: 'Red color'
    };

    const result = await resolveAlias(token);

    expect(result).toEqual(token);
    expect(mockFigma.variables.getVariableByIdAsync).not.toHaveBeenCalled();
  });

  it('resolves alias from local variables map', async () => {
    variables.set('local-var-1.color', 'LocalVariable');

    const token: Token = {
      $value: '{local-var-1}',
      $type: 'color',
      $description: 'Local variable'
    };

    const result = await resolveAlias(token);

    expect(result).toEqual({
      $value: '{LocalVariable}',
      $type: 'color',
      $description: 'Local variable'
    });
    expect(mockFigma.variables.getVariableByIdAsync).not.toHaveBeenCalled();
  });

  it('resolves external variable when not found in local map', async () => {
    const mockVariable = {
      id: 'external-var-1',
      valuesByMode: {
        'mode-1': { r: 0, g: 1, b: 0 }
      }
    };

    mockFigma.variables.getVariableByIdAsync.mockResolvedValue(mockVariable);

    const token: Token = {
      $value: '{external-var-1}',
      $type: 'color',
      $description: 'External variable'
    };

    const result = await resolveAlias(token);

    expect(result).toEqual({
      $value: 'rgb(0, 255, 0)',
      $type: 'color',
      $description: 'External variable'
    });
    expect(mockFigma.variables.getVariableByIdAsync).toHaveBeenCalledWith('external-var-1');
  });

  it('returns null when external variable cannot be resolved', async () => {
    mockFigma.variables.getVariableByIdAsync.mockResolvedValue(null);

    const token: Token = {
      $value: '{non-existent-var}',
      $type: 'color',
      $description: 'Non-existent variable'
    };

    const result = await resolveAlias(token);

    expect(result).toBeNull();
  });

  it('handles nested aliases in external variables', async () => {
    const colorVariable = {
      id: 'color-var',
      valuesByMode: {
        'mode-1': { r: 1, g: 0, b: 1 }
      }
    };

    const aliasVariable = {
      id: 'alias-var',
      valuesByMode: {
        'mode-1': { id: 'color-var' }
      }
    };

    mockFigma.variables.getVariableByIdAsync
      .mockResolvedValueOnce(aliasVariable)
      .mockResolvedValueOnce(colorVariable);

    const token: Token = {
      $value: '{alias-var}',
      $type: 'color',
      $description: 'Nested alias'
    };

    const result = await resolveAlias(token);

    expect(result).toEqual({
      $value: 'rgb(255, 0, 255)',
      $type: 'color',
      $description: 'Nested alias'
    });
  });
});
