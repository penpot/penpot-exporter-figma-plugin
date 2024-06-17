import { Uuid } from './uuid';

export type ImageColor = {
  'name'?: string;
  'width': number;
  'height': number;
  'mtype'?: string;
  'id'?: Uuid;
  'keep-aspect-ratio'?: boolean;
  'data-uri'?: string;
};

// @TODO: move to any other place
export type PartialImageColor = {
  imageHash: string;
};
