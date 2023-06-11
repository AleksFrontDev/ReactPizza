import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  pizza: "",
};

const singlePizzaSlice = createSlice({
  name: "singlePizza",
  initialState,
  reducers: {
    setPizza(state, action) {
      state.items = action.payload;
    },
  },
});

export const fetchPizza = createAsyncThunk(
  "pizza/fetchPizzasStatus",
  async (id) => {
    const { data } = await axios.get(
      `https://6460b48efe8d6fb29e35726a.mockapi.io/objects/` + id
    );

    return setPizza(data);
  }
);
export const selectSinglePizzaData = (state) => state.pizza;

export const { setPizza } = singlePizzaSlice.actions;

export default singlePizzaSlice.reducer;
