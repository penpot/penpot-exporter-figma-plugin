import { Provider } from 'preact';
// @TODO: Try to use react
import { createContext, useContext } from 'react';

export const createGenericContext = <T>(): [<K extends T>() => K, Provider<T | undefined>] => {
  const genericContext = createContext<T | undefined>(undefined);

  const useGenericContext = <K extends T>(): K => {
    const context = useContext(genericContext);

    if (!context) {
      throw new Error('useGenericContext must be used within a Provider');
    }

    return context as K;
  };

  return [useGenericContext, genericContext.Provider];
};
