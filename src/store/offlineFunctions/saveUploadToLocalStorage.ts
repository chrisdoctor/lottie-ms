import {
  LOCALSTORAGE_CACHED_ITEMS_KEY,
  LOCALSTORAGE_UPLOADED_ITEMS_KEY,
} from "../../constants";
import { LottieItem } from "../../interfaces";

export const saveUploadToLocalStorage = (item: LottieItem) => {
  //Save uploaded data to uploaded items
  const offlineUploadedData = JSON.parse(
    localStorage.getItem(LOCALSTORAGE_UPLOADED_ITEMS_KEY) || "[]"
  );
  offlineUploadedData.push(item);
  localStorage.setItem(
    LOCALSTORAGE_UPLOADED_ITEMS_KEY,
    JSON.stringify(offlineUploadedData)
  );

  // Add uploaded item to the rest of cached items
  const offlineCachedData = JSON.parse(
    localStorage.getItem(LOCALSTORAGE_CACHED_ITEMS_KEY) || "[]"
  );
  offlineCachedData.push(item);
  localStorage.setItem(
    LOCALSTORAGE_CACHED_ITEMS_KEY,
    JSON.stringify(offlineCachedData)
  );
};
