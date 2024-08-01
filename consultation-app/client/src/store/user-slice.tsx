import { UserState } from '../utility/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: UserState = { user: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    logout(state) {
      state.user = null;
    }
  }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
