import { createSlice } from "@reduxjs/toolkit";
import { LottieItem } from "../interfaces";
import {
  LOCALSTORAGE_CACHED_ITEMS_KEY,
  API_STATUS_FAIL,
  API_STATUS_LOADING,
  API_STATUS_SUCCESS,
} from "../constants";
import { searchItems } from "./graphql/searchItems";
import { addItem } from "./graphql/addItem";
import { saveSearchToLocalStorage } from "./offlineFunctions/saveSearchToLocalStorage";

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

const containsSubstring = (array: string[], substring: string): boolean => {
  return array.some((element) => element.includes(substring));
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
      .addCase(addItem.fulfilled, (state, action) => {
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

        saveSearchToLocalStorage(action.payload.searchItems);

        // Save data to localStorage
        // const localStorageData = JSON.parse(
        //   localStorage.getItem(LOCALSTORAGE_CACHED_ITEMS_KEY) || "[]"
        // );
        // const mergedData = mergeUniqueData(
        //   localStorageData,
        //   action.payload.searchItems
        // );
        // localStorage.setItem(
        //   LOCALSTORAGE_CACHED_ITEMS_KEY,
        //   JSON.stringify(mergedData)
        // );
      })
      .addCase(searchItems.rejected, (state, action) => {
        // Search failed; try to use data from localStorage
        if (!navigator.onLine) {
          const localStorageData = JSON.parse(
            localStorage.getItem(LOCALSTORAGE_CACHED_ITEMS_KEY) || "[]"
          );
          const searchKey = action.meta.arg;
          const filteredData = localStorageData.filter(
            (item: any) =>
              item.description.includes(searchKey) ||
              containsSubstring(item.tags, searchKey)
          );
          state.items = filteredData;
          state.status = API_STATUS_SUCCESS;
        }
      });
  },
});

export const { resetState } = itemSlice.actions;

export default itemSlice.reducer;
