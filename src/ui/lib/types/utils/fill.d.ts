import { Gradient } from './gradient';
import { Uuid } from './uuid';

type Fill = {
  fillColor?: string;
  fillOpacity?: number;
  fillColorGradient?: Gradient;
  fillColorRefFile?: Uuid;
  fillColorRefId?: Uuid;
};
