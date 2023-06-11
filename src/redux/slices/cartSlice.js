import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  objects: [],
  totalPrice: 0,
  totalCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // addItem(state, action) {
    //   state.objects.push(action.payload);
    //   state.totalPrice = state.objects.reduce((sum, obj) => {
    //     return obj.price + sum;
    //   }, 0);

    addItem(state, action) {
      const findItem = state.objects.find(
        (obj) => obj.id === action.payload.id
      );
      if (findItem) {
        findItem.count++;
      } else {
        state.objects.push({ ...action.payload, count: 1 });
      }
      state.totalPrice = state.objects.reduce((sum, obj) => {
        return obj.price * obj.count + sum;
      }, 0);
      state.totalCount = state.objects.reduce((sum, obj) => {
        return obj.count + sum;
      }, 0);
    },
    minusItem(state, action) {
      const findItem = state.objects.find((obj) => obj.id === action.payload);
      if (minusItem) {
        findItem.count--;
      }
    },
    removeItem(state, action) {
      state.objects = state.objects.filter((obj) => obj.id !== action.payload);
      if (removeItem)
        state.totalCount = state.objects.reduce((sum, obj) => {
          return obj.count - sum;
        }, 0);
      state.totalPrice = state.objects.reduce((sum, obj) => {
        return obj.price * obj.count - sum;
      }, 0);
    },
    clearItems(state) {
      state.objects = [];
      state.totalCount = 0;
      state.totalPrice = 0;
    },
  },
});

export const selectCart = (state) => state.cart;
export const selectCartItemById = (id) => (state) =>
  state.cart.objects.find((obj) => obj.id === id);

export const { addItem, removeItem, minusItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
