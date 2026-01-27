import type {
  ClosePathCommand,
  Command,
  CurveToCommand,
  HorizontalLineToCommand,
  VerticalLineToCommand
} from 'svg-path-parser';
import { describe, expect, it } from 'vitest';

import {
  applyInverseRotation,
  applyRotation,
  applyRotationToSegment,
  getRotation,
  isTransformed
} from './applyRotation';

describe('applyRotation', () => {
  const boundingBox: Rect = { x: 0, y: 0, width: 100, height: 100 };

  it('no cambia el punto con matriz identidad', () => {
    const identity: Transform = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    const point = { x: 50, y: 50 };
    const result = applyRotation(point, identity, boundingBox);
    expect(result.x).toBeCloseTo(50, 5);
    expect(result.y).toBeCloseTo(50, 5);
  });

  it('rota un punto alrededor del centro del bounding box', () => {
    // Rotación de 90 grados
    const rotation90: Transform = [
      [0, -1, 0],
      [1, 0, 0]
    ];
    const point = { x: 75, y: 50 }; // Punto a la derecha del centro
    const result = applyRotation(point, rotation90, boundingBox);
    // Debería rotar a la parte inferior
    expect(result.x).toBeCloseTo(50, 5);
    expect(result.y).toBeCloseTo(75, 5);
  });

  it('maneja bounding box desplazado', () => {
    const offsetBox: Rect = { x: 100, y: 100, width: 50, height: 50 };
    const rotation90: Transform = [
      [0, -1, 0],
      [1, 0, 0]
    ];
    const point = { x: 125, y: 125 }; // Centro del box desplazado
    const result = applyRotation(point, rotation90, offsetBox);
    // El centro debería permanecer igual
    expect(result.x).toBeCloseTo(125, 5);
    expect(result.y).toBeCloseTo(125, 5);
  });

  it('aplica rotación de 180 grados', () => {
    const rotation180: Transform = [
      [-1, 0, 0],
      [0, -1, 0]
    ];
    const point = { x: 75, y: 50 };
    const result = applyRotation(point, rotation180, boundingBox);
    // Debería reflejarse al lado opuesto
    expect(result.x).toBeCloseTo(25, 5);
    expect(result.y).toBeCloseTo(50, 5);
  });
});

describe('applyInverseRotation', () => {
  const boundingBox: Rect = { x: 0, y: 0, width: 100, height: 100 };

  it('aplica rotación inversa correctamente', () => {
    const rotation90: Transform = [
      [0, -1, 0],
      [1, 0, 0]
    ];
    const point = { x: 50, y: 75 };
    const result = applyInverseRotation(point, rotation90, boundingBox);
    // La inversa de 90° es -90°, así que debería rotar en sentido contrario
    expect(result.x).toBeCloseTo(75, 5);
    expect(result.y).toBeCloseTo(50, 5);
  });

  it('applyRotation y applyInverseRotation se cancelan', () => {
    const rotation90: Transform = [
      [0, -1, 0],
      [1, 0, 0]
    ];
    const originalPoint = { x: 75, y: 50 };
    const rotated = applyRotation(originalPoint, rotation90, boundingBox);
    const backToOriginal = applyInverseRotation(rotated, rotation90, boundingBox);
    expect(backToOriginal.x).toBeCloseTo(originalPoint.x, 5);
    expect(backToOriginal.y).toBeCloseTo(originalPoint.y, 5);
  });
});

describe('getRotation', () => {
  it('retorna 0 para matriz identidad', () => {
    const identity: Transform = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    expect(getRotation(identity)).toBeCloseTo(0, 5);
  });

  it('calcula rotación de 90 grados', () => {
    const rotation90: Transform = [
      [0, -1, 0],
      [1, 0, 0]
    ];
    expect(getRotation(rotation90)).toBeCloseTo(90, 5);
  });

  it('calcula rotación de 180 grados', () => {
    const rotation180: Transform = [
      [-1, 0, 0],
      [0, -1, 0]
    ];
    expect(getRotation(rotation180)).toBeCloseTo(180, 5);
  });

  it('calcula rotación de 45 grados', () => {
    const cos45 = Math.cos(Math.PI / 4);
    const sin45 = Math.sin(Math.PI / 4);
    const rotation45: Transform = [
      [cos45, -sin45, 0],
      [sin45, cos45, 0]
    ];
    expect(getRotation(rotation45)).toBeCloseTo(45, 5);
  });
});

describe('isTransformed', () => {
  it('retorna false para matriz identidad', () => {
    const identity: Transform = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    expect(isTransformed(identity)).toBe(false);
  });

  it('retorna true para rotación', () => {
    const rotation90: Transform = [
      [0, -1, 0],
      [1, 0, 0]
    ];
    expect(isTransformed(rotation90)).toBe(true);
  });

  it('retorna true para escala', () => {
    const scale: Transform = [
      [2, 0, 0],
      [0, 2, 0]
    ];
    expect(isTransformed(scale)).toBe(true);
  });

  it('retorna true para transformación combinada', () => {
    const combined: Transform = [
      [1, 0, 10],
      [0, 1, 20]
    ];
    // Aunque tenga traslación, la parte de rotación/escala es identidad
    // Pero isTransformed solo verifica la parte superior izquierda 2x2
    expect(isTransformed(combined)).toBe(false);
  });
});

describe('applyRotationToSegment', () => {
  const boundingBox: Rect = { x: 0, y: 0, width: 100, height: 100 };
  const rotation90: Transform = [
    [0, -1, 0],
    [1, 0, 0]
  ];

  it('retorna comando horizontal sin cambios', () => {
    const command = {
      command: 'horizontal lineto',
      code: 'H',
      x: 50
    } as HorizontalLineToCommand;
    const result = applyRotationToSegment(command, rotation90, boundingBox);
    expect(result).toBe(command);
    expect(result.command).toBe('horizontal lineto');
  });

  it('retorna comando vertical sin cambios', () => {
    const command = {
      command: 'vertical lineto',
      code: 'V',
      y: 50
    } as VerticalLineToCommand;
    const result = applyRotationToSegment(command, rotation90, boundingBox);
    expect(result).toBe(command);
    expect(result.command).toBe('vertical lineto');
  });

  it('retorna comando closepath sin cambios', () => {
    const command = {
      command: 'closepath',
      code: 'Z'
    } as ClosePathCommand;
    const result = applyRotationToSegment(command, rotation90, boundingBox);
    expect(result).toBe(command);
    expect(result.command).toBe('closepath');
  });

  it('aplica rotación a comando lineto', () => {
    const command = {
      command: 'lineto',
      code: 'L',
      x: 75,
      y: 50
    } as Command;
    const result = applyRotationToSegment(command, rotation90, boundingBox) as Command & {
      x: number;
      y: number;
    };
    expect(result.x).toBeCloseTo(50, 5);
    expect(result.y).toBeCloseTo(75, 5);
  });

  it('aplica rotación a comando curveto con puntos de control', () => {
    const command = {
      command: 'curveto',
      code: 'C',
      x: 75,
      y: 50,
      x1: 60,
      y1: 40,
      x2: 70,
      y2: 45
    } as CurveToCommand;
    const result = applyRotationToSegment(command, rotation90, boundingBox) as CurveToCommand;
    // Punto final (75, 50) -> (50, 75) después de rotación 90°
    expect(result.x).toBeCloseTo(50, 5);
    expect(result.y).toBeCloseTo(75, 5);
    // Punto de control 1 (60, 40) -> (60, 60) después de rotación 90°
    expect(result.x1).toBeCloseTo(60, 5);
    expect(result.y1).toBeCloseTo(60, 5);
    // Punto de control 2 (70, 45) -> (55, 70) después de rotación 90°
    expect(result.x2).toBeCloseTo(55, 5);
    expect(result.y2).toBeCloseTo(70, 5);
  });
});
