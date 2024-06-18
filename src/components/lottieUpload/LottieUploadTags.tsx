import React, { useState } from "react";

interface TagsInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const LottieUploadTags: React.FC<TagsInputProps> = ({ tags, setTags }) => {
  const [tag, setTag] = useState("");

  const addTag = () => {
    if (tag.trim()) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Tags:</label>
      <div className="flex items-center">
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="flex-1 mt-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Type a tag"
        />
        <button
          onClick={addTag}
          className="ml-2 mt-1 p-2 bg-teal-500 text-white rounded-lg"
        >
          Add
        </button>
      </div>
      <div className="mt-2 flex flex-wrap">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2 mt-2"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="ml-2 text-teal-500"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LottieUploadTags;
