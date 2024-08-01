import { useSelector } from 'react-redux';
import { App_State } from '../store/store';
import { IDENTIFIER } from '../utility/types';

export default function useCache<T>(identifier: IDENTIFIER) {
  const state = useSelector((state: App_State) => state.app[identifier]);
  const cache = JSON.parse(
    sessionStorage.getItem(identifier) as string
  ) as typeof state;

  const value = (cache || state) as T;
  return { value };
}
