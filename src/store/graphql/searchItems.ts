import { createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "graphql-request";
import { apiClient } from "./apiClient";

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
    return apiClient.request(query, variables);
  }
);
