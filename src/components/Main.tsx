import React from "react";
// import LottiePreview from "./LottiePreview";
// import LottieUpload from "./LottieUpload";
import LottieSearch from "./LottieSearch";

const Main: React.FC = () => {
  const openUploadDialog = () => {
    alert("Upload dialog will open here.");
    // Logic to open upload dialog will be added later
  };

  return (
    <div className="flex items-center justify-start md:justify-center h-screen bg-gray-100">
      <div className="container bg-white p-8 rounded-lg shadow-lg text-left md:text-center">
        <h1 className="text-2xl">Lottie Animation</h1>
        <h2 className="text-base font-sans mb-6">Management System</h2>
        <LottieSearch />
        <button
          className="mt-6 px-4 py-2 bg-teal-500 text-white rounded-md"
          onClick={openUploadDialog}
        >
          Upload Animation
        </button>
      </div>
    </div>
  );
};

export default Main;
