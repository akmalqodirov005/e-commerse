import { createSlice } from "@reduxjs/toolkit";

// LocalStorage dan xavfsiz o'qish funksiyasi
const safeParse = (item) => {
  try {
    const value = localStorage.getItem(item);
    if (!value || value === "undefined") return null; // null yoki "undefined" bo'lsa
    return JSON.parse(value);
  } catch (error) {
    console.log(error);
    return null; // xatolik bo'lsa ham null qaytaradi
  }
};

const initialState = {
  user: safeParse("user"),
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload?.user;
      state.accessToken = action.payload?.access_token;
      state.refreshToken = action.payload?.refresh_token;

      // LocalStorage ga saqlash
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("accessToken", state.accessToken);
      localStorage.setItem("refreshToken", state.refreshToken);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      // LocalStorage dan o'chirish
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;