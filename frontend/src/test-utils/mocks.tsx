import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { RootState } from '../store';
import reducers from '../store/reducers';
export const getMockStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: reducers,
    preloadedState,
  });
};
