import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const qty = product.qty || 1; // ⬅ qty yo‘q bo‘lsa default = 1

      const exist = state.items.find((item) => item.id === product.id);

      if (exist) {
        exist.qty += qty; // ⬅ endi hech qachon NaN bo‘lmaydi
      } else {
        state.items.push({ ...product, qty }); // ⬅ qty to‘g‘ri qo‘shiladi
      }
    },
    increase: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.qty += 1;
    },
    decrease: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.qty > 1) item.qty -= 1;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

export const { addToCart, decrease, increase, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
