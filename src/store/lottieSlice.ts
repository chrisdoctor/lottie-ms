import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";
import { LottieItem } from "../interfaces";
import {
  LOCALSTORAGE_CACHED_ITEMS_KEY,
  LOCALSTORAGE_UPLOADED_ITEMS_KEY,
} from "../constants";

const endpoint = "http://localhost:4000/graphql";
const client = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});

interface ItemState {
  item: LottieItem | null;
  items: LottieItem[];
  status: null | "loading" | "success" | "fail";
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

// Async thunk for getting an item
export const getItem = createAsyncThunk("item/getItem", async (id: string) => {
  const query = gql`
    query GetItem($id: String!) {
      item(id: $id) {
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
  const variables = { id };
  return client.request(query, variables);
});

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
        state.status = "loading";
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.status = "success";
        state.items.push(action.payload.addItem);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || null;
      })
      .addCase(getItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItem.fulfilled, (state, action) => {
        state.status = "success";
        state.item = action.payload.item;
      })
      .addCase(getItem.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || null;
      })
      .addCase(searchItems.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchItems.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload.searchItems;

        // Save data to localStorage
        const existingData = JSON.parse(
          localStorage.getItem(LOCALSTORAGE_CACHED_ITEMS_KEY) || "[]"
        );
        const mergedData = mergeUniqueData(
          existingData,
          action.payload.searchItems
        );
        localStorage.setItem(
          LOCALSTORAGE_CACHED_ITEMS_KEY,
          JSON.stringify(mergedData)
        );
      })
      .addCase(searchItems.rejected, (state, action) => {
        // Search failed; try to use data from localStorage
        const savedData = JSON.parse(
          localStorage.getItem(LOCALSTORAGE_CACHED_ITEMS_KEY) || "[]"
        );
        const searchKey = action.meta.arg;
        const filteredData = savedData.filter(
          (item: any) =>
            item.description.includes(searchKey) ||
            containsSubstring(item.tags, searchKey)
        );

        state.items = filteredData;
      });
  },
});

export const { resetState } = itemSlice.actions;

export default itemSlice.reducer;
