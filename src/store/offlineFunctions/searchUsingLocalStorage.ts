import { LOCALSTORAGE_CACHED_ITEMS_KEY } from "../../constants";
import { LottieItem } from "../../interfaces";

export const searchUsingLocalStorage = (searchKey: string): LottieItem[] => {
  const localStorageData = JSON.parse(
    localStorage.getItem(LOCALSTORAGE_CACHED_ITEMS_KEY) || "[]"
  );
  const filteredData: LottieItem[] = localStorageData.filter(
    (item: any) =>
      item.description.includes(searchKey) ||
      containsSubstring(item.tags, searchKey)
  );

  return filteredData;
};

const containsSubstring = (array: string[], substring: string): boolean => {
  return array.some((element) => element.includes(substring));
};
