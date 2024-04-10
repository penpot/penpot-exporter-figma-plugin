import { Gradient } from './gradient';

type Fill = {
  fillColor?: string;
  fillOpacity?: number;
  fillColorGradient?: Gradient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fillColorRefFile?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fillColorRefId?: any;
};
