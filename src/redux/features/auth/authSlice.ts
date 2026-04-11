import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TUser = {
  id: string;
  email: string;
  role: 'EMPLOYER' | 'CANDIDATE';
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
  role: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: TUser; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.role = user.role;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
