import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

type Pizza = {
  id:string,
  price:number,
  imageUrl:string,
  title:string,
  type: number,
  size: number,
  count:number
} 

 export enum Status {
 LOADING = "loading" , SUCESS= "success", ERROR= "error"
}

interface PizzaSliceState {
  items:Pizza[] ;
  status: Status
}

export type SearchPizzaParams = {
  sortBy:string, order:string, category:string, search:string, currentPage:string
}

export const fetchPizzas = createAsyncThunk<Pizza[] , SearchPizzaParams >(
  "pizza/fetchPizzasStatus",
  async (params) => {
    const { sortBy, order, category, search, currentPage } = params;
    const { data } = await axios.get<Pizza[]>(
      `https://6460b48efe8d6fb29e35726a.mockapi.io/objects?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`
    );
    return data;
  }
);




const initialState:PizzaSliceState = {
  items: [],
  status: Status.LOADING, // loading | success | error
};

const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Pizza[]>) {
      state.items = action.payload;
      state.items = [];
    },
  },


  extraReducers: (builder) => {
    builder.addCase(fetchPizzas.pending, (state, action) => {
state.status = Status.LOADING;
  state.items = [];

    });
    builder.addCase(fetchPizzas.fulfilled, (state, action) => {
      state.items = action.payload;
            state.status = Status.SUCESS;

    });
    builder.addCase(fetchPizzas.rejected, (state, action) => {
state.status =Status.ERROR;
state.items = [];

    });
  },
});

export const selectPizzaData = (state:RootState) => state.pizza;

export const { setItems } =
  pizzaSlice.actions;

export default pizzaSlice.reducer;
