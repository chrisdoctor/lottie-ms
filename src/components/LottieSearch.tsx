import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItem, resetState } from "../store/lottieSlice";
import { AppDispatch, RootState } from "../store";

const LottieSearch: React.FC = () => {
  const [id, setId] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const item = useSelector((state: RootState) => state.item.item);
  // const itemStatus = useSelector((state: RootState) => state.item.status);
  const error = useSelector((state: RootState) => state.item.error);

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(getItem(id));
  };

  const handleSearchChange = (keyword: string) => {
    dispatch(resetState());
    setId(keyword);
  };

  return (
    <div>
      <div className="flex justify-start md:justify-center mb-6">
        <input
          type="text"
          value={id}
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
      {id && (
        <div className="results">
          {item && (
            <div>
              <h3>Response</h3>
              <p>ID: {item.id}</p>
              <p>Description: {item.description}</p>
            </div>
          )}
          {error && <p>Error: {error}</p>}
        </div>
      )}
    </div>
  );
};

export default LottieSearch;
