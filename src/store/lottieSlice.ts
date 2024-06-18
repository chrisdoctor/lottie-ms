import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";
import { LottieItem } from "../interfaces";
import {
  LOCALSTORAGE_CACHED_ITEMS_KEY,
  LOCALSTORAGE_UPLOADED_ITEMS_KEY,
  API_STATUS_FAIL,
  API_STATUS_LOADING,
  API_STATUS_SUCCESS,
} from "../constants";

const endpoint = process.env.GRAPHQL_API_ENDPOINT;
const client = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});

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

// Async thunk for adding an item
export const addItem = createAsyncThunk(
  "item/addItem",
  async (item: LottieItem) => {
    if (!navigator.onLine) {
      // Save item to localStorage if offline
      const offlineData = JSON.parse(
        localStorage.getItem(LOCALSTORAGE_UPLOADED_ITEMS_KEY) || "[]"
      );
      offlineData.push(item);
      localStorage.setItem(
        LOCALSTORAGE_UPLOADED_ITEMS_KEY,
        JSON.stringify(offlineData)
      );
      return { addItem: item };
    } else {
      const mutation = gql`
        mutation AddItem(
          $id: String!
          $description: String!
          $author: String!
          $tags: [String!]!
          $dateUploaded: String!
          $lottieFile: LottieFileInput!
        ) {
          addItem(
            id: $id
            description: $description
            author: $author
            tags: $tags
            dateUploaded: $dateUploaded
            lottieFile: $lottieFile
          ) {
            id
            description
            author
            tags
            dateUploaded
            lottieFile {
              filename
              contents
            }
          }
        }
      `;
      return client.request(mutation, item);
    }
  }
);

// Async thunk for searching for items
export const searchItems = createAsyncThunk(
  "items/searchItems",
  async (keyword: string) => {
    const query = gql`
      query SearchItems($keyword: String!) {
        searchItems(keyword: $keyword) {
          id
          description
          author
          tags
          dateUploaded
          lottieFile {
            filename
            contents
          }
        }
      }
    `;
    const variables = { keyword };
    return client.request(query, variables);
  }
);

const mergeUniqueData = (existingData: any[], newData: any[]) => {
  const mergedData = [...existingData];
  const existingIds = new Set(existingData.map((item) => item.id));

  newData.forEach((item) => {
    if (!existingIds.has(item.id)) {
      mergedData.push(item);
    }
  });

  return mergedData;
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

        // Save data to localStorage
        const localStorageData = JSON.parse(
          localStorage.getItem(LOCALSTORAGE_CACHED_ITEMS_KEY) || "[]"
        );
        const mergedData = mergeUniqueData(
          localStorageData,
          action.payload.searchItems
        );
        localStorage.setItem(
          LOCALSTORAGE_CACHED_ITEMS_KEY,
          JSON.stringify(mergedData)
        );
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
