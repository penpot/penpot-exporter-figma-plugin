import type { Uuid } from './uuid';

// Penpot models background blur as its own shape attribute (not as a `Blur`
// variant) and requires every field, unlike the layer blur where `id` is
// optional. Only the WebGL renderer paints it; the SVG renderer ignores it.
export type BackgroundBlur = {
  id: Uuid;
  type: 'background-blur';
  value: number;
  hidden: boolean;
};
