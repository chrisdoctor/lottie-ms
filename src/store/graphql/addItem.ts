import { createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "graphql-request";
import { apiClient } from "./apiClient";
import { LottieItem } from "../../interfaces";
import { LOCALSTORAGE_UPLOADED_ITEMS_KEY } from "../../constants";

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
      return apiClient.request(mutation, item);
    }
  }
);
