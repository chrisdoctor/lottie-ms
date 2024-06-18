import { createSlice } from "@reduxjs/toolkit";
import { LottieItem } from "../interfaces";
import {
  API_STATUS_FAIL,
  API_STATUS_LOADING,
  API_STATUS_SUCCESS,
} from "../constants";
import { searchItems } from "./graphql/searchItems";
import { addItem } from "./graphql/addItem";
import { saveSearchToLocalStorage } from "./offlineFunctions/saveSearchToLocalStorage";
import { searchUsingLocalStorage } from "./offlineFunctions/searchUsingLocalStorage";

interface ItemState {
  item: LottieItem | null;
  items: LottieItem[];
  status:
    | null
    | typeof API_STATUS_LOADING
    | typeof API_STATUS_SUCCESS
    | typeof API_STATUS_FAIL;
  error: string | null;
}

const initialState: ItemState = {
  item: null,
  items: [],
  status: null,
  error: null,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItem.pending, (state) => {
        state.status = API_STATUS_LOADING;
      })
      .addCase(addItem.fulfilled, (state, _action) => {
        state.status = API_STATUS_SUCCESS;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.status = API_STATUS_FAIL;
        state.error = action.error.message || null;
      })
      .addCase(searchItems.pending, (state) => {
        state.status = API_STATUS_LOADING;
        state.error = null;
      })
      .addCase(searchItems.fulfilled, (state, action) => {
        state.status = API_STATUS_SUCCESS;
        state.items = action.payload.searchItems;

        // Keep copy of data in localStorage while online
        saveSearchToLocalStorage(action.payload.searchItems);
      })
      .addCase(searchItems.rejected, (state, action) => {
        // Search failed; try to use data from localStorage
        if (!navigator.onLine) {
          state.items = searchUsingLocalStorage(action.meta.arg);
          state.status = API_STATUS_SUCCESS;
        }
      });
  },
});

export const { resetState } = itemSlice.actions;

export default itemSlice.reducer;
