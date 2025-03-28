import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  currentUser: null,
  tokenExpiry: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.currentUser = null;
      state.tokenExpiry = null;
    },
    setUser: (state, action) => {
      state.currentUser = action.payload.user;
      state.tokenExpiry = state.tokenExpiry ?? action.payload.expiryTime;
    },
    updateUser: (state, action) => {
      state.currentUser = action.payload.user;
    },
  },
});

export const { login, logout, setUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
