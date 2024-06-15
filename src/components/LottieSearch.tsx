import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetState, searchItems } from "../store/lottieSlice";
import { AppDispatch, RootState } from "../store";
import LottiePreview from "./LottiePreview";

const LottieSearch: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.item.items);
  // const itemStatus = useSelector((state: RootState) => state.item.status);
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
      <div className="flex justify-start md:justify-center mb-6">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search for animations..."
          className="w-3/4 md:w-1/2 p-2 border border-gray-300 rounded-l-md focus:outline-none"
        />
        <button
          onClick={handleSearchClick}
          className="px-4 py-2 bg-teal-500 text-white rounded-r-md"
        >
          Search
        </button>
      </div>
      {searchKeyword && (
        <div className="results">
          {items.length > 0 &&
            items.map((item) => (
              <div>
                <LottiePreview animation={item.lottieFile.contents} />
                <div className="text-sm">
                  <p>Description: {item.description}</p>
                  <p>Tags: {item.tags}</p>
                  <p>Author: {item.author}</p>
                  <p>Uploaded: {item.dateUploaded}</p>
                </div>
              </div>
            ))}
          {error && <p>Search encountered an error: {error}</p>}
        </div>
      )}
    </div>
  );
};

export default LottieSearch;
