import { createSlice } from '@reduxjs/toolkit';
import { DoctorState } from '../utility/types';

const initialState: DoctorState = {
  doctors: [],
  doctor: null
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setDoctors(state, action) {
      state.doctors = action.payload;
    },
    setDoctor(state, action) {
      state.doctor = action.payload;
    }
  }
});

export const doctorActions = doctorSlice.actions;
export default doctorSlice.reducer;
