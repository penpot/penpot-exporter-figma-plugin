export type Gradient = {
  type: symbol; // linear or radial
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  stops: GradientStop[];
};

type GradientStop = {
  color: string;
  opacity?: number;
  offset: number;
};
