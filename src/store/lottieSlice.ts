import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";

const endpoint = "http://localhost:4000/graphql";
const client = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});

interface LottieFile {
  filename: string;
  contents: string;
}

interface Item {
  id: string;
  description: string;
  author: string;
  tags: string[];
  dateUploaded: string;
  lottieFile: LottieFile;
}

interface ItemState {
  item: Item | null;
  items: Item[];
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
  async ({
    id,
    description,
    author,
    tags,
    dateUploaded,
    lottieFile,
  }: {
    id: string;
    description: string;
    author: string;
    tags: string[];
    dateUploaded: string;
    lottieFile: LottieFile;
  }) => {
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
    const variables = {
      id,
      description,
      author,
      tags,
      dateUploaded,
      lottieFile,
    };
    return client.request(mutation, variables);
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
      })
      .addCase(searchItems.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message || null;
      });
  },
});

export const { resetState } = itemSlice.actions;

export default itemSlice.reducer;
