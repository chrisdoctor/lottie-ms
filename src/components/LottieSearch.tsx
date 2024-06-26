import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetState } from "../store/lottieSlice";
import { searchItems } from "../store/graphql/searchItems";
import { AppDispatch, RootState } from "../store";
import LottiePreview from "./LottiePreview";
import { API_STATUS_FAIL, API_STATUS_SUCCESS } from "../constants";

const LottieSearch: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.item.items);
  const itemStatus = useSelector((state: RootState) => state.item.status);
  const error = useSelector((state: RootState) => state.item.error);

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchItems(searchKeyword));
  };

  const handleSearchChange = (keyword: string) => {
    dispatch(resetState());
    setSearchKeyword(keyword);
  };

  return (
    <div>
      <form onSubmit={handleSearchClick}>
        <div className="flex justify-start md:justify-center mb-6">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search for animations..."
            className="w-3/4 md:w-1/2 p-2 border border-gray-300 rounded-l-md"
          />
          <button
            type="submit"
            onClick={handleSearchClick}
            className="px-4 py-2 bg-teal-500 text-white rounded-r-md"
          >
            Search
          </button>
        </div>
      </form>
      {searchKeyword && itemStatus === API_STATUS_SUCCESS && (
        <div className="overflow-x-auto justify-around flex space-x-4 p-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div className="min-w-[180px] sm:mx-4" key={item.id}>
                <LottiePreview animation={item.lottieFile.contents} />
                <div className="text-sm">
                  <p>Description: {item.description}</p>
                  <p>Tags: {item.tags}</p>
                  <p>Author: {item.author}</p>
                  <p>Uploaded: {item.dateUploaded}</p>
                </div>
              </div>
            ))
          ) : (
            <p font-bold text-base mt-1>
              Sorry, no animations found
            </p>
          )}
        </div>
      )}
      {searchKeyword && itemStatus === API_STATUS_FAIL && (
        <p font-bold text-base mt-1>
          Error encountered: {error}
        </p>
      )}
    </div>
  );
};

export default LottieSearch;
