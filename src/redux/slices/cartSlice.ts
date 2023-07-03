import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {RootState}  from "../store";

export type CartItem = {
  id:string,
  price:number,
  imageUrl:string,
  title:string,
  type: string,
  size: number,
  count:number
}



interface CartSliceState {
  totalPrice:number,
  totalCount:number,
  objects: CartItem[]
} 

const initialState: CartSliceState = {
  objects: [],
  totalPrice: 0,
  totalCount: 0,
};


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const findItems = state.objects.find(
        (obj) => obj.id === action.payload.id
      );
      if (findItems) {
        findItems.count++;
      } else {
        state.objects.push({ ...action.payload, count: 1 });
      }
      state.totalCount = state.objects.reduce((sum, obj) => {
        return obj.count + sum;
      }, 0);

      state.totalPrice = state.objects.reduce((sum, obj) => {
        return obj.price * obj.count + sum;
      }, 0);
    },
    minusItem(state:CartSliceState, action: PayloadAction<string>) {
      const findItem = state.objects.find((obj) => obj.id === action.payload);
      if (findItem) {
        findItem.count--;
      }else {
        state.objects.pop()
      }

      state.totalCount = state.objects.reduce((sum, obj) => {
        return  obj.count + sum;
      }, 0);
      
    state.totalPrice = state.objects.reduce((sum, obj) => {
      return obj.price * obj.count + sum;
    }, 0);
      state.objects = state.objects.filter((obj) => obj.count !== 0);
    },
    removeItem(state:CartSliceState, action: PayloadAction<string>) {
      state.objects = state.objects.filter((obj) => obj.id !== action.payload);
    
      state.totalCount = state.objects.reduce((sum, obj) => {
        return  obj.count + sum;
      }, 0);
      
    state.totalPrice = state.objects.reduce((sum, obj) => {
      return obj.price * obj.count + sum;
    }, 0);
    },
    
    clearItems(state) {
      state.objects = [];
      state.totalCount = 0;
      state.totalPrice = 0;
    },
  },
});


export const selectCart = (state:RootState) => state.cart;
export const selectCartItemById = (id:string) => (state:RootState) =>
  state.cart.objects.find((obj) => obj.id === id);

export const { addItem, removeItem, minusItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
