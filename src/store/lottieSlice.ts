import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";

const endpoint = "http://localhost:4000/graphql";
const client = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});

interface Item {
  id: string;
  description: string;
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
  async ({ id, description }: { id: string; description: string }) => {
    const mutation = gql`
      mutation AddItem($id: String!, $description: String!) {
        addItem(id: $id, description: $description) {
          id
          description
        }
      }
    `;
    const variables = { id, description };
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
      }
    }
  `;
  const variables = { id };
  return client.request(query, variables);
});

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
      });
  },
});

export const { resetState } = itemSlice.actions;

export default itemSlice.reducer;
