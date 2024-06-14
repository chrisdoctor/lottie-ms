import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../store/lottieSlice";
import { AppDispatch, RootState } from "../store";

const LottieUpload: React.FC = () => {
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const itemStatus = useSelector((state: RootState) => state.item.status);
  const error = useSelector((state: RootState) => state.item.error);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addItem({ id, description }));
  };

  return (
    <div>
      <h2>Upload Lottie</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ID:
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit">Upload Lottie</button>
      </form>
      {itemStatus === "loading" && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default LottieUpload;
