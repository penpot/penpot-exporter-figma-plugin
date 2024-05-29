import { Uuid } from '@ui/lib/types/utils/uuid';

export type InstanceShape = InstanceAttributes;

type InstanceAttributes = {
  type?: 'instance';
  componentId: Uuid;
};
