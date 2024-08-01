import homeSlice from './home-slice';
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({ reducer: { home: homeSlice.reducer } });
