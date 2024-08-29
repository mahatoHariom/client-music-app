import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AuthState {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    dob: string;
    address: string;
    gender: string;
    role: string;
  } | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthState["user"]>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
