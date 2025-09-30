import type { Provider } from 'preact';
import { createContext } from 'preact/compat';
import { useContext } from 'preact/hooks';

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
