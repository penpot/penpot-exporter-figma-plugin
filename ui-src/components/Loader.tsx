type LoaderProps = {
  loading: boolean;
};

export const Loader = ({ loading }: LoaderProps) => {
  if (!loading) return;

  return <section>Checking for missing fonts...</section>;
};
