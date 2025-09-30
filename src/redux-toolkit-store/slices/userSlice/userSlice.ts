import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from '@reduxjs/toolkit'

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  role?: "admin" | null;
  token: string | null;
}

interface UserDataType {
  isLoggedIn: boolean;
  userData: UserState | null;
}

const initialState: UserDataType = {
 userData: null,
 isLoggedIn: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      state.userData = action.payload
      state.isLoggedIn = true
    },
    clearUserData: () => initialState,
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
