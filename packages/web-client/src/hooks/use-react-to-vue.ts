import { useBabel } from './use-babel';
import { hooksToCompositionPlugin } from 'babel-plugin-hooks-to-composition';
import { useState, useEffect } from 'react';
import { defaultExample } from '../common/examples';
import { prettierFormat } from '../utils';

const STORAGE_KEY = 'react_code' as const;

const getInitialCode = (): string => {
  try {
    const initialCode = localStorage.getItem(STORAGE_KEY) || defaultExample.code;
    return prettierFormat(initialCode);
  } catch {
    return defaultExample.code;
  }
}

export const useReactToVue = () => {
  const [reactCode, setReactCode] = useState<string>(getInitialCode);
  
  const {
    transform: transformReactCode,
    error: reactError,
    code: vueCode,
  } = useBabel([hooksToCompositionPlugin]);

  useEffect(() => {
    transformReactCode(reactCode);
    localStorage.setItem(STORAGE_KEY, reactCode);
  }, [reactCode]);

  return {
    vueCode,
    reactError,
    reactCode,
    setReactCode,
  }
}