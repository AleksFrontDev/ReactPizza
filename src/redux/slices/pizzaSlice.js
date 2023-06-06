import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPizzas = createAsyncThunk(
  "pizza/fetchPizzasStatus",
  async (params) => {
    const { sortBy, order, category, search, currentPage } = params;
    const { data } = await axios.get(
      `https://6460b48efe8d6fb29e35726a.mockapi.io/objects?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`
    );
    return data;
  }
);

const initialState = {
  items: [],
  status: "loading", // loading | success | error
};

const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
      state.items = [];
    },
  },
  extraReducers: {
    [fetchPizzas.pending]: (state) => {
      state.status = "loading";
    },
    [fetchPizzas.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.status = "success";
    },
    [fetchPizzas.rejected]: (state) => {
      state.status = "error";
      state.items = [];
    },
  },
});
//   extraReducers: (builder) => {
//     builder.addCase(fetchPizzas.pending, (state, action) => {
//       state.items.push(action.payload);
//       console.log("Идет отправка");
//     });
//     builder.addCase(fetchPizzas.fulfilled, (state, action) => {
//       state.items.push(action.payload);
//       console.log("Все ок");
//     });
//     builder.addCase(fetchPizzas.rejected, (state, action) => {
//       state.items.push(action.payload);
//       console.log("была ошибка");
//     });
//   },
// });

export const { setItems, sortBy, order, category, search, currentPage } =
  pizzaSlice.actions;

export default pizzaSlice.reducer;
