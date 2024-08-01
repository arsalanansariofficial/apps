import { configureStore } from '@reduxjs/toolkit';
import appReducer, { App_Slice } from './app-slice';

const store = configureStore({
  reducer: { app: appReducer }
});

export default store;

export interface App_State {
  app: App_Slice;
}
