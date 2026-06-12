import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  status: boolean;
  userData: {
    token?: string;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  } | null;
}

const initialState: AuthState = {
  status: false,
  userData: null,
};

const AuthSlice = createSlice({
  name: "AuthReducer",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.status = true;
      state.userData = action.payload; // expects { token, user: { id, name, email } }
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
    updateProfile: (state, action: PayloadAction<any>) => {
      if (state.userData && state.userData.user) {
        state.userData.user = {
          ...state.userData.user,
          ...action.payload, // expects { name } or other profile fields
        };
      }
    },
  },
});

export const { login, logout, updateProfile } = AuthSlice.actions;

export default AuthSlice.reducer;
