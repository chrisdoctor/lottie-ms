import React, { useState } from "react";
// import LottiePreview from "./LottiePreview";
import LottieSearch from "./LottieSearch";
import LottieUpload from "./LottieUpload";

const Main: React.FC = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-start md:justify-center h-screen bg-gray-100">
      <div className="container bg-white p-8 rounded-lg shadow-lg text-left md:text-center">
        <h1 className="text-2xl">Lottie Animation</h1>
        <h2 className="text-base font-sans mb-6">Management System</h2>
        <LottieSearch />
        <button
          className="mt-6 px-4 py-2 bg-teal-500 text-white rounded-md"
          onClick={() => setIsUploadDialogOpen(true)}
        >
          Upload Animation
        </button>
      </div>

      <LottieUpload
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
      />
    </div>
  );
};

export default Main;
