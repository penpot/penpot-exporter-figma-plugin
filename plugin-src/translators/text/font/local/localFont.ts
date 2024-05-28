export type LocalFont = {
  id: string;
  name: string;
  family: string;
  variants?: Variant[];
};

type Variant = {
  id: string;
  name: string;
  weight: string;
  style: string;
  suffix?: string;
};
