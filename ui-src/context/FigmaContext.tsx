import { JSX, PropsWithChildren } from 'react';

import { createGenericContext } from '@ui/context/createGenericContext';
import { UseFigmaHook, useFigma } from '@ui/context/useFigma';

const [useFigmaContext, StateContextProvider] = createGenericContext<UseFigmaHook>();

const FigmaProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const hook = useFigma();

  return <StateContextProvider value={hook}>{children}</StateContextProvider>;
};

export { FigmaProvider, useFigmaContext };
