export type ImageAttributes = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id?: any;
  type: symbol;
  // TODO: Investigate where it comes from
  dataUri?: string;
  metadata: {
    width: number;
    height: number;
    mtype?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id?: any;
  };
};
