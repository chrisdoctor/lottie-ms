import { LOCALSTORAGE_CACHED_ITEMS_KEY } from "../../constants";
import { LottieItem } from "../../interfaces";

export const saveSearchToLocalStorage = (searchResults: LottieItem[]) => {
  // Save data to localStorage
  const localStorageData = JSON.parse(
    localStorage.getItem(LOCALSTORAGE_CACHED_ITEMS_KEY) || "[]"
  );
  const mergedData = mergeUniqueData(localStorageData, searchResults);
  localStorage.setItem(
    LOCALSTORAGE_CACHED_ITEMS_KEY,
    JSON.stringify(mergedData)
  );
};

const mergeUniqueData = (existingData: LottieItem[], newData: LottieItem[]) => {
  const mergedData = [...existingData];
  const existingIds = new Set(existingData.map((item) => item.id));

  newData.forEach((item) => {
    if (!existingIds.has(item.id)) {
      mergedData.push(item);
    }
  });

  return mergedData;
};
