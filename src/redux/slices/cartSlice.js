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
    removeItem(state, action) {
      state.objects = state.objects.filter((obj) => obj.id !== action.payload);
    },
    clearItems(state) {
      state.objects = [];
    },
  },
});

export const { addItem, removeItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
