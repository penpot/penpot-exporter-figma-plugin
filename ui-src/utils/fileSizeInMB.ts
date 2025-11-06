export const fileSizeInMB = (size: number): string => {
  return (size / (1024 * 1024)).toFixed(2) + ' MB';
};
