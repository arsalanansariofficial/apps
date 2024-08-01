import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user-slice';
import doctorReducer from './doctor-slice';

const store = configureStore({
  reducer: { doctor: doctorReducer, user: userReducer }
});

export default store;
